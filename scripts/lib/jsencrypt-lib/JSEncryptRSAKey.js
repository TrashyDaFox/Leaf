var __extends =
    (this && this.__extends) ||
    (function () {
        var extendStatics = function (d, b) {
            extendStatics =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                        d.__proto__ = b;
                    }) ||
                function (d, b) {
                    for (var p in b)
                        if (Object.prototype.hasOwnProperty.call(b, p))
                            d[p] = b[p];
                };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError(
                    "Class extends value " +
                        String(b) +
                        " is not a constructor or null"
                );
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype =
                b === null
                    ? Object.create(b)
                    : ((__.prototype = b.prototype), new __());
        };
    })();
import { hex2b64 } from "./lib/jsbn/base64";
import { Hex } from "./lib/asn1js/hex";
import { Base64 } from "./lib/asn1js/base64";
import { ASN1 } from "./lib/asn1js/asn1";
import { RSAKey } from "./lib/jsbn/rsa";
import { parseBigInt } from "./lib/jsbn/jsbn";
import { KJUR } from "./lib/jsrsasign/asn1-1.0";
/**
 * Create a new JSEncryptRSAKey that extends Tom Wu's RSA key object.
 * This object is just a decorator for parsing the key parameter
 * @param {string|Object} key - The key in string format, or an object containing
 * the parameters needed to build a RSAKey object.
 * @constructor
 */
var JSEncryptRSAKey = /** @class */ (function (_super) {
    __extends(JSEncryptRSAKey, _super);
    function JSEncryptRSAKey(key) {
        var _this = _super.call(this) || this;
        // Call the super constructor.
        //  RSAKey.call(this);
        // If a key key was provided.
        if (key) {
            // If this is a string...
            if (typeof key === "string") {
                _this.parseKey(key);
            } else if (
                JSEncryptRSAKey.hasPrivateKeyProperty(key) ||
                JSEncryptRSAKey.hasPublicKeyProperty(key)
            ) {
                // Set the values for the key.
                _this.parsePropertiesFrom(key);
            }
        }
        return _this;
    }
    /**
     * Method to parse a pem encoded string containing both a public or private key.
     * The method will translate the pem encoded string in a der encoded string and
     * will parse private key and public key parameters. This method accepts public key
     * in the rsaencryption pkcs #1 format (oid: 1.2.840.113549.1.1.1).
     *
     * @todo Check how many rsa formats use the same format of pkcs #1.
     *
     * The format is defined as:
     * PublicKeyInfo ::= SEQUENCE {
     *   algorithm       AlgorithmIdentifier,
     *   PublicKey       BIT STRING
     * }
     * Where AlgorithmIdentifier is:
     * AlgorithmIdentifier ::= SEQUENCE {
     *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
     *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
     * }
     * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
     * RSAPublicKey ::= SEQUENCE {
     *   modulus           INTEGER,  -- n
     *   publicExponent    INTEGER   -- e
     * }
     * it's possible to examine the structure of the keys obtained from openssl using
     * an asn.1 dumper as the one used here to parse the components: http://lapo.it/asn1js/
     * @argument {string} pem the pem encoded string, can include the BEGIN/END header/footer
     * @private
     */
    JSEncryptRSAKey.prototype.parseKey = function (pem) {
        try {
            var modulus = 0;
            var public_exponent = 0;
            var reHex = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/;
            var der = reHex.test(pem) ? Hex.decode(pem) : Base64.unarmor(pem);
            var asn1 = ASN1.decode(der);
            // Fixes a bug with OpenSSL 1.0+ private keys
            if (asn1.sub.length === 3) {
                asn1 = asn1.sub[2].sub[0];
            }
            if (asn1.sub.length === 9) {
                // Parse the private key.
                modulus = asn1.sub[1].getHexStringValue(); // bigint
                this.n = parseBigInt(modulus, 16);
                public_exponent = asn1.sub[2].getHexStringValue(); // int
                this.e = parseInt(public_exponent, 16);
                var private_exponent = asn1.sub[3].getHexStringValue(); // bigint
                this.d = parseBigInt(private_exponent, 16);
                var prime1 = asn1.sub[4].getHexStringValue(); // bigint
                this.p = parseBigInt(prime1, 16);
                var prime2 = asn1.sub[5].getHexStringValue(); // bigint
                this.q = parseBigInt(prime2, 16);
                var exponent1 = asn1.sub[6].getHexStringValue(); // bigint
                this.dmp1 = parseBigInt(exponent1, 16);
                var exponent2 = asn1.sub[7].getHexStringValue(); // bigint
                this.dmq1 = parseBigInt(exponent2, 16);
                var coefficient = asn1.sub[8].getHexStringValue(); // bigint
                this.coeff = parseBigInt(coefficient, 16);
            } else if (asn1.sub.length === 2) {
                if (asn1.sub[0].sub) {
                    // Parse ASN.1 SubjectPublicKeyInfo type as defined by X.509
                    var bit_string = asn1.sub[1];
                    var sequence = bit_string.sub[0];
                    modulus = sequence.sub[0].getHexStringValue();
                    this.n = parseBigInt(modulus, 16);
                    public_exponent = sequence.sub[1].getHexStringValue();
                    this.e = parseInt(public_exponent, 16);
                } else {
                    // Parse ASN.1 RSAPublicKey type as defined by PKCS #1
                    modulus = asn1.sub[0].getHexStringValue();
                    this.n = parseBigInt(modulus, 16);
                    public_exponent = asn1.sub[1].getHexStringValue();
                    this.e = parseInt(public_exponent, 16);
                }
            } else {
                return false;
            }
            return true;
        } catch (ex) {
            return false;
        }
    };
    /**
     * Translate rsa parameters in a hex encoded string representing the rsa key.
     *
     * The translation follow the ASN.1 notation :
     * RSAPrivateKey ::= SEQUENCE {
     *   version           Version,
     *   modulus           INTEGER,  -- n
     *   publicExponent    INTEGER,  -- e
     *   privateExponent   INTEGER,  -- d
     *   prime1            INTEGER,  -- p
     *   prime2            INTEGER,  -- q
     *   exponent1         INTEGER,  -- d mod (p1)
     *   exponent2         INTEGER,  -- d mod (q-1)
     *   coefficient       INTEGER,  -- (inverse of q) mod p
     * }
     * @returns {string}  DER Encoded String representing the rsa private key
     * @private
     */
    JSEncryptRSAKey.prototype.getPrivateBaseKey = function () {
        var options = {
            array: [
                new KJUR.asn1.DERInteger({ int: 0 }),
                new KJUR.asn1.DERInteger({ bigint: this.n }),
                new KJUR.asn1.DERInteger({ int: this.e }),
                new KJUR.asn1.DERInteger({ bigint: this.d }),
                new KJUR.asn1.DERInteger({ bigint: this.p }),
                new KJUR.asn1.DERInteger({ bigint: this.q }),
                new KJUR.asn1.DERInteger({ bigint: this.dmp1 }),
                new KJUR.asn1.DERInteger({ bigint: this.dmq1 }),
                new KJUR.asn1.DERInteger({ bigint: this.coeff }),
            ],
        };
        var seq = new KJUR.asn1.DERSequence(options);
        return seq.getEncodedHex();
    };
    /**
     * base64 (pem) encoded version of the DER encoded representation
     * @returns {string} pem encoded representation without header and footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPrivateBaseKeyB64 = function () {
        return hex2b64(this.getPrivateBaseKey());
    };
    /**
     * Translate rsa parameters in a hex encoded string representing the rsa public key.
     * The representation follow the ASN.1 notation :
     * PublicKeyInfo ::= SEQUENCE {
     *   algorithm       AlgorithmIdentifier,
     *   PublicKey       BIT STRING
     * }
     * Where AlgorithmIdentifier is:
     * AlgorithmIdentifier ::= SEQUENCE {
     *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
     *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
     * }
     * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
     * RSAPublicKey ::= SEQUENCE {
     *   modulus           INTEGER,  -- n
     *   publicExponent    INTEGER   -- e
     * }
     * @returns {string} DER Encoded String representing the rsa public key
     * @private
     */
    JSEncryptRSAKey.prototype.getPublicBaseKey = function () {
        var first_sequence = new KJUR.asn1.DERSequence({
            array: [
                new KJUR.asn1.DERObjectIdentifier({
                    oid: "1.2.840.113549.1.1.1",
                }),
                new KJUR.asn1.DERNull(),
            ],
        });
        var second_sequence = new KJUR.asn1.DERSequence({
            array: [
                new KJUR.asn1.DERInteger({ bigint: this.n }),
                new KJUR.asn1.DERInteger({ int: this.e }),
            ],
        });
        var bit_string = new KJUR.asn1.DERBitString({
            hex: "00" + second_sequence.getEncodedHex(),
        });
        var seq = new KJUR.asn1.DERSequence({
            array: [first_sequence, bit_string],
        });
        return seq.getEncodedHex();
    };
    /**
     * base64 (pem) encoded version of the DER encoded representation
     * @returns {string} pem encoded representation without header and footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPublicBaseKeyB64 = function () {
        return hex2b64(this.getPublicBaseKey());
    };
    /**
     * wrap the string in block of width chars. The default value for rsa keys is 64
     * characters.
     * @param {string} str the pem encoded string without header and footer
     * @param {Number} [width=64] - the length the string has to be wrapped at
     * @returns {string}
     * @private
     */
    JSEncryptRSAKey.wordwrap = function (str, width) {
        width = width || 64;
        if (!str) {
            return str;
        }
        var regex = "(.{1," + width + "})( +|$\n?)|(.{1," + width + "})";
        return str.match(RegExp(regex, "g")).join("\n");
    };
    /**
     * Retrieve the pem encoded private key
     * @returns {string} the pem encoded private key with header/footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPrivateKey = function () {
        var key = "-----BEGIN RSA PRIVATE KEY-----\n";
        key += JSEncryptRSAKey.wordwrap(this.getPrivateBaseKeyB64()) + "\n";
        key += "-----END RSA PRIVATE KEY-----";
        return key;
    };
    /**
     * Retrieve the pem encoded public key
     * @returns {string} the pem encoded public key with header/footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPublicKey = function () {
        var key = "-----BEGIN PUBLIC KEY-----\n";
        key += JSEncryptRSAKey.wordwrap(this.getPublicBaseKeyB64()) + "\n";
        key += "-----END PUBLIC KEY-----";
        return key;
    };
    /**
     * Check if the object contains the necessary parameters to populate the rsa modulus
     * and public exponent parameters.
     * @param {Object} [obj={}] - An object that may contain the two public key
     * parameters
     * @returns {boolean} true if the object contains both the modulus and the public exponent
     * properties (n and e)
     * @todo check for types of n and e. N should be a parseable bigInt object, E should
     * be a parseable integer number
     * @private
     */
    JSEncryptRSAKey.hasPublicKeyProperty = function (obj) {
        obj = obj || {};
        return obj.hasOwnProperty("n") && obj.hasOwnProperty("e");
    };
    /**
     * Check if the object contains ALL the parameters of an RSA key.
     * @param {Object} [obj={}] - An object that may contain nine rsa key
     * parameters
     * @returns {boolean} true if the object contains all the parameters needed
     * @todo check for types of the parameters all the parameters but the public exponent
     * should be parseable bigint objects, the public exponent should be a parseable integer number
     * @private
     */
    JSEncryptRSAKey.hasPrivateKeyProperty = function (obj) {
        obj = obj || {};
        return (
            obj.hasOwnProperty("n") &&
            obj.hasOwnProperty("e") &&
            obj.hasOwnProperty("d") &&
            obj.hasOwnProperty("p") &&
            obj.hasOwnProperty("q") &&
            obj.hasOwnProperty("dmp1") &&
            obj.hasOwnProperty("dmq1") &&
            obj.hasOwnProperty("coeff")
        );
    };
    /**
     * Parse the properties of obj in the current rsa object. Obj should AT LEAST
     * include the modulus and public exponent (n, e) parameters.
     * @param {Object} obj - the object containing rsa parameters
     * @private
     */
    JSEncryptRSAKey.prototype.parsePropertiesFrom = function (obj) {
        this.n = obj.n;
        this.e = obj.e;
        if (obj.hasOwnProperty("d")) {
            this.d = obj.d;
            this.p = obj.p;
            this.q = obj.q;
            this.dmp1 = obj.dmp1;
            this.dmq1 = obj.dmq1;
            this.coeff = obj.coeff;
        }
    };
    return JSEncryptRSAKey;
})(RSAKey);
export { JSEncryptRSAKey };
