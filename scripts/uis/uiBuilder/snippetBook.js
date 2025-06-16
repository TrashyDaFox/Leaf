import uiBuilder from "../../api/uiBuilder";
import uiManager from "../../uiManager";
import versionData from "../../versionData";

uiManager.addUI("snippet_book", "", (player) => {
    let snippetBook = uiBuilder.getSnippetBook();
    uiManager.open(
        player,
        versionData.uiNames.UIBuilderEditButtons,
        snippetBook.id
    );
});
