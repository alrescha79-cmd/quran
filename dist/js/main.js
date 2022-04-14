// Darkmode toggle
const darkToggle = document.querySelector('#dark-toggle');
const darkToggle1 = document.querySelector('#dark-toggle1');
const html = document.querySelector('html');

darkToggle.addEventListener('click', function () {
  if (darkToggle.checked) {
    html.classList.add('dark');
    localStorage.theme = 'dark';
  }else {
    html.classList.remove('dark');
    localStorage.theme = 'light';
  }
});

darkToggle1.addEventListener('click', function () {
  if (darkToggle1.checked) {
    html.classList.add('dark');
    localStorage.theme = 'dark';
  }else {
    html.classList.remove('dark');
    localStorage.theme = 'light';
  }
});

// pindahkan posisi toggle sesuai mode 
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  darkToggle.checked = true;
} else {
  darkToggle.checked = false;
}

if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  darkToggle1.checked = true;
} else {
  darkToggle1.checked = false;
}

let params = new URLSearchParams(location.search);

if (params.get("surat") == null) {
    document.location.href = "?surat=1";
} else {
    const sidebarToggle = document.querySelector("#sidebar-toggle");
    const sidebar = document.querySelector("#sidebar");
    const cari = document.querySelector(".search");
    sidebarToggle.addEventListener("click", function () {
        sidebar.classList.toggle("translate-x-0");
        sidebar.classList.toggle("-translate-x-72");
    });
// klik diluar navbar
    window.addEventListener('click', function (e) {
        if (e.target != sidebarToggle && e.target != sidebar) {
            sidebar.classList.remove("translate-x-0");
            sidebar.classList.add("-translate-x-72");
        }
    });

    const search = document.querySelectorAll(".search");
    search.forEach((s) => {
        s.addEventListener("submit", (e) => {
            e.preventDefault();

            const inputValue = e.target.querySelector("input").value;
            let keyword;

            fetch("https://api.quran.sutanlab.id/surah")
                .then((response) => response.json())
                .then((response) => {
                    for (let i = 0; i < response.data.length; i++) {
                        if (inputValue.toLowerCase() == response.data[i].name.transliteration.id.toLowerCase()) {
                            keyword = response.data[i].number;
                            document.location.href = "?surat=" + keyword;
                            break;
                        } else {
                            keyword = false;
                        }
                    }

                    if (!keyword) {
                        return alert("Surat tidak ditemukan");
                    }
                });
        });
    });

    const surat = params.get("surat");

    fetch("https://api.quran.sutanlab.id/surah/" + surat)
        .then((response) => response.json())
        .then((response) => {
            let ayahList = document.querySelector("#ayah-list");
            let surahHeader = document.querySelector("#surah-header");
            let ayah = "";
            const surahData = response.data;

            surahHeader.querySelector('h1').innerHTML = `${surahData.name.transliteration.id} (${surahData.name.translation.id})`;

            document.querySelectorAll('.web-desc').forEach(webDesc => {
                webDesc.setAttribute('content', surahData.deskripsi);
            });

            surahData.verses.forEach((r) => {
                ayah += `<div class="space-y-2">
                                <span class="uppercase tracking-widest font-semibold text-sm text-teal-800 dark:text-gray-500">Ayat ${r.number.inSurah}</span>
                                <div class="space-y-5 ">
                                    <audio class="bg-white rounded-xl ring-1 dark:ring ring-teal-500 dark:ring-gray-400" controls src="${r.audio.primary}">
                                        Your browser does not support the
                                        <code>audio</code> element.
                                    </audio>
                                    <h2 id="arabic-ayah" class="font-bold text-center md:text-4xl sm:text-3xl text-2xl md:leading-[4.8rem] sm:leading-[4.2rem] leading-[3.2rem] font-['Amiri'] tracking-[1px] text-teal-800 border-2 rounded-lg  ring-1 ring-teal-500 bg-teal-400 bg-opacity-25 dark:bg-gray-400 dark:text-black">${r.text.arab}</h2>
                                    <p class="font-['poppins']   bg-teal-500 ring-1 ring-rose-400 text-white max-w-fit py-2 px-6 rounded-xl shadow-xl text-xs dark:bg-gray-400 dark:text-black dark:ring-white">${r.translation.id}</p>
                                </div>
                            </div>`;
            });
            ayahList.innerHTML = ayah;
        });

        fetch("https://api.quran.sutanlab.id/surah")
            .then((response) => response.json())
            .then((response) => {
                let surahList = document.querySelector("#surah-list");
                let surah = "";

                response.data.forEach((r) => {
                    surah += `<div class="flex items-center dark:bg-gray-400  dark:rounded-lg p-1 bg-teal-200 bg-opacity-50 rounded-lg gap-1">
                                <span class="text-sm h-8 w-8 min-h-[2rem] min-w-[2rem] font-medium 
                                ${
                                    r.number != surat
                                        ? "border border-teal-600 text-teal-600 dark:border-black dark:text-black"
                                        : "bg-teal-500 dark:bg-gray-800 hover:bg-teal-600 text-white"
                                } 
                                rounded-md flex justify-center items-center">${
                                    r.number
                                }</span>
                                <a class="block font-medium hover:bg-teal-600 hover:text-white text-teal-600 dark:text-black dark:hover:text-white dark:hover:bg-gray-800 w-full py-1 px-2 rounded-md transition-all duration-300" 
                                    href="?surat=${r.number}">
                                    ${r.name.transliteration.id}
                                </a>
                            </div>`;
                });

                surahList.innerHTML = surah;
            });
}
