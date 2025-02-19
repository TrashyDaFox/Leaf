Unlike everything else in leaf, ui builder uses its own database and formatting

--------  UI Encoding  --------

All UIs are separated by a semicolon (;)

UI Format

1. type (0 = ACTION, 1 = ACTION_SYSTEM)
2. Unique ID of the UI
3. title encoded in base64>,
4. body encoded in base64, if not defined use "NONE">,
5. <scriptevent encoded in base64>,
6. subuis encoded in base64, should be a ui list string. if there are none put "NONE">
7. control data (each encoded in base64 and separated by a ,)
8. extensions (each separated by a ,). The extension list is hardcoded and shouldnt interfere with the separator characters, so no base64 required here. if no extensions are used on the form, put "NONE"
9. contributors (each separated by a ,). A list of every players names who edited the UI, with the first ones being more recent. Each encoded in base64
10. updated at (current timestamp in milliseconds)
11. version history (a ui list encoded in base64, with newer versions being first). PLEASE LIMIT THIS LIST TO 10 VERSIONS. if no edits are on the form, just put "NONE"
12. original creator (the name of the player who created this form, in base64)
13. editor (for use in version history, the name of the player who edited this form. if it is the original form and not in the version history, put it as "NONE")
14. version (the leafbuilder version of when this ui was made, currently 1)
15. password protected toggle (either true or false)
16. password (if password protected toggle enabled, it is the password as a SHA256 hash. if not, just use "NONE")
all these parts are separated by a .

--------  Control Encoding (Type 0, Button) --------

All buttons are in this format but encoded in base64

1. text encoded in base64
2. subtext encoded in base64, if subtext is not defined, put "NONE"
3. action encoded in base64
4. icon encoded in base64, if undefined put "NONE"
5. required tag encoded in base64, if undefined put "NONE"

0.<1>.<2>.<3>.<4>.<5>

--------  Why this system  --------

Why not?