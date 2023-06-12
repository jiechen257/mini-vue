import SearchBarCreator from "./searchBar.ts";

// 作为单例使用
const searchBar = new SearchBarCreator();

function openSearchBar() {
    searchBar.present();
}

function closeSearchBar() {
    searchBar.dismiss();
}

export { openSearchBar, closeSearchBar };