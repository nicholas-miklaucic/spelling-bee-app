const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
}

function submit() {
    const BASE_URL = window.location.origin;

    let other_letters = "";
    for (i = 1; i <= 6; i += 1) {
        other_letters += document.getElementById("other" + i).value;
    }

    let center = document.getElementById("center").value;

    window.location.href = BASE_URL +
        "?center=" +
        center.toUpperCase() +
        "&others=" +
        other_letters.toUpperCase().split('').sort().join('');
}

document.getElementById("submit").onClick = submit;
