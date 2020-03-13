const searchContainer = document.querySelector("#search-container")
const profileContainer = document.querySelector(".profile-container")
const inputUser = document.querySelector(".username-input")
const useImg = document.querySelector("#userPic")
const userName = document.querySelector("#userName")
const tabElements = document.querySelectorAll(".tabElement")
const bio = document.querySelector("#bio")
const place = document.querySelector("#place")
const activePageContainer = document.querySelector(".activePageContainer")
const gitDivContainer = document.querySelector(".gitDiv")

document.querySelector(".search-button").addEventListener("click", () => {
    searchContainer.style.display = "none";
    document.querySelector("body").style.background = "none";
    profileContainer.style.display = "block";

    fetch(`https://api.github.com/users/${inputUser.value}`).then(res =>
        res.json()
    ).then(res => {
        useImg.setAttribute("src", res.avatar_url)
        userName.innerHTML = res.name
        bio.innerHTML = res.bio
        place.innerHTML = res.location
        document.querySelector(".tabElement").classList.add("active")
        addingEventListeners();
        reloadPage();
        function reloadPage() {
            activePage = document.querySelector(".tabElement.active")
            switch (activePage.innerHTML) {
                case "Overview":
                    {
                        activePageContainer.innerHTML = "";
                        fetch(`https://api.github.com/users/${res.login}/repos`).then(repores => repores.json()).then
                            (repores => {
                                repores.forEach((repo) => {
                                    fetch(`https://api.github.com/repos/${res.login}/${repo.name}/branches`).then(allBranches => allBranches.json()).then((allBranches) => {
                                        function checkBranch() {
                                            let check = false;
                                            if (allBranches != []) {
                                                allBranches.forEach(branch => {
                                                    if (branch.name === "gh-pages")
                                                        check = true
                                                })
                                            }
                                            return check;
                                        }
                                        let check = checkBranch()
                                        if (check) {
                                            let repoDiv = document.createElement("div")
                                            repoDiv.innerHTML =
                                                `    <a class="repo-box" href="https://${res.login}.github.io/${repo.name}" target="_blank">
                                                     <h3 style="text-decoration: underline;">${repo.name}</h3>
                                                     <h5>${repo.description}</h5>
                                                    </a>
                                                 `
                                            activePageContainer.append(repoDiv)
                                        }
                                    }).catch((error) => console.log(error))
                                })
                            }).catch((repoError) => console.log("error"))

                    }
                    break;
                case "All Repos":
                    {
                        activePageContainer.innerHTML = "";
                        fetch(`https://api.github.com/users/${res.login}/repos`).then(repores => repores.json()).then
                            (repores => {
                                console.log(repores)
                                repores.forEach((repo) => {
                                    let repoDiv = document.createElement("div")
                                    repoDiv.innerHTML =
                                        `    <a class="repo-box" href="https://${res.login}.github.io/${repo.name}" target="_blank">
                                             <h3 style="text-decoration: underline;">${repo.name}</h3>
                                             <h5>${repo.description}</h5>
                                            </a>
                                         `
                                    activePageContainer.append(repoDiv)
                                }
                                )
                            }).catch((repoError) => console.log(repoError))

                    }
                    break;
                case "About Github":
                    {
                        activePageContainer.innerHTML = "";
                        gitDivContainer.style.display = "block";
                        activePageContainer.append(gitDivContainer);
                    }
                    break;

                default:
                    { }
            }

        }
        function addingEventListeners() {
            tabElements.forEach((element) => {
                element.addEventListener("click", () => {
                    document.querySelector(".tabElement.active").classList.remove("active")
                    element.classList.add("active");
                    reloadPage();
                })
                element.addEventListener("dblclick", () => {
                    document.querySelector(".tabElement.active").classList.remove("active")
                    element.classList.add("active");
                    reloadPage();
                })
            })
        }
    }
    )
        .catch(err => console.log(err))
}
)