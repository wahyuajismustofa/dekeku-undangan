import dekeku, { dekekuFunction as _dF } from "https://cdn.jsdelivr.net/gh/wahyuajismustofa/dekeku@215ccb0861eb4c0db7a555e14c6800f8394acca1/assets/js/dekeku.js";

const fileName = "testing-undangan";
let filePesan = {};
let fileTamu = {};
let fileSeller = {};

export async function init(){
  _dF.waitForCondition(
    () => typeof dekeku !== "undefined" && dekeku.ready === true,
    async () => {
      await initUndangan();
    },
    {
      timeout: 5000,
      onTimeout: () => console.error("Gagal menunggu dekeku.ready"),
    }
  );  
}

function getParams(){
  dekeku.params = _dF.readURLParams();
}

function gantiIsiClass(className, nilaiBaru) {
  const elemenList = document.querySelectorAll('.data-' + className);

  if (elemenList.length === 0) {
    console.warn(`Tidak ditemukan elemen dengan class '${className}'`);
    return;
  }

  elemenList.forEach(el => {
  if (typeof nilaiBaru === 'string' || typeof nilaiBaru === 'number') {
    el.textContent = String(nilaiBaru);
  } else {
    console.warn('Nilai harus berupa string atau angka.');
  }
  });

}

function initRSVP() {
  const container = document.getElementById("rsvpContainer");
  if (!container || !dekeku.params.namaTamu) return;  
  renderRSVP();

  dekeku.proxy[fileTamu.nama] = _dF.makeFlagProxy(renderRSVP);
  initAttendanceToggle();

  container.addEventListener("click", function (e) {
    if (e.target && e.target.id === "changeRSVP") {
      renderRSVP("update");
      initAttendanceToggle();
    }
  });
}

function renderRSVP(set) {
  const container = document.getElementById("rsvpContainer");
  if (!container || !dekeku.params.namaTamu) return;
  const kehadiran = set || dekeku?.dataJson?.tamu?.kehadiran || "";

  let html = "";

  if (kehadiran === "Hadir") {
    html = `
      <div class="rsvp-message-wrap going" data-aos="fade-up" data-aos-duration="1200">
        <div class="rsvp-message-content">
          <h4 class="rsvp-message-title">Hadir</h4>
          <p class="rsvp-message-caption">Yeyy, terimakasiih sudah mau datang... <br> Sampai jumpa disana ;)</p>
        </div>
      </div>
      <div class="rsvp-change-wrap" data-aos="fade-up" data-aos-duration="1200">
        <div class="rsvp-confirm-wrap">
          <button class="rsvp-confirm-btn confirm" id="changeRSVP">Ubah</button>
        </div>
      </div>
    `;
  } else if (kehadiran === "Tidak Hadir") {
    html = `
      <div class="rsvp-message-wrap not-going" data-aos="fade-up" data-aos-duration="1200">
        <div class="rsvp-message-content">
          <h4 class="rsvp-message-title">Tidak Hadir</h4>
          <p class="rsvp-message-caption">Terima kasih atas konfirmasinya. Semoga kita bisa bertemu di lain kesempatan 😊</p>
        </div>
      </div>
      <div class="rsvp-change-wrap" data-aos="fade-up" data-aos-duration="1200">
        <div class="rsvp-confirm-wrap">
          <button class="rsvp-confirm-btn confirm" id="changeRSVP">Ubah</button>
        </div>
      </div>
    `;
  } else {
    const aksi = kehadiran === "update" ? "github-update" : "github-post";
    const filter = kehadiran === "update" 
      ? JSON.stringify({ nama: dekeku.params.namaTamu })
      : undefined;

    html = `
      <form data-aksi="${aksi}" data-file="${fileTamu.file}" ${filter ? `data-filter='${filter}'` : ""} data-dekeku_proxy="true">
        <!-- Status -->
        <div class="rsvp-status-wrap">
          <div class="rsvp-status-head" data-aos="fade-up" data-aos-duration="1200">
            <p class="rsvp-status-caption">Apakah kamu datang?</p>
          </div>
          <div class="rsvp-status-body">
            <div class="rsvp-confirm-wrap">
              <label data-aos="fade-up" data-aos-duration="1200">
                <input type="radio" name="kehadiran" value="Hadir" data-required="">
                <div class="rsvp-confirm-btn going">Hadir</div>
              </label>
              <label data-aos="fade-up" data-aos-duration="1200">
                <input type="radio" name="kehadiran" value="Tidak Hadir" data-required="">
                <div class="rsvp-confirm-btn not-going">Tidak Hadir</div>
              </label>
            </div>
          </div>
        </div>

        <!-- Session -->
        <div class="rsvp-session-wrap" id="rsvp-session">
          <div class="session-caption-wrap">
            <p class="caption" data-aos="fade-up" data-aos-duration="1200">Acara mana yang akan Anda hadiri?</p>
          </div>
          <div class="session-btn-wrap">
            <label data-aos="fade-up" data-aos-duration="1200">
              <input type="checkbox" name="acara[]" value="Akad Nikah">
              <div class="rsvp-session-btn">Akad Nikah</div>
            </label>
            <label data-aos="fade-up" data-aos-duration="1200">
              <input type="checkbox" name="acara[]" value="Resepsi">
              <div class="rsvp-session-btn">Resepsi</div>
            </label>
          </div>
        </div>

        <input type="hidden" name="nama" value="${dekeku.params.namaTamu}">
        
        <!-- Submit -->
        <div class="rsvp-confirm-wrap" data-aos="fade-up" data-aos-duration="1200">
          <button type="submit" class="rsvp-confirm-btn confirm submit">Konfirmasi</button>
        </div>
      </form>
    `;
  }

  container.innerHTML = html;
}


function initAttendanceToggle() {
  const radios = document.querySelectorAll('input[name="kehadiran"]');
  const acara = document.getElementById('rsvp-session');
  const inputAcara = document.querySelectorAll('input[name="acara[]"]');

  if (!acara || radios.length === 0) return;

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === "Tidak Hadir" && radio.checked) {
        acara.style.display = "none";
        inputAcara.forEach(cb => cb.checked = false);
      } else if (radio.value === "Hadir" && radio.checked) {
        acara.style.display = "";
      }
    });
  });
}
function initFormKomentar(){
  renderKomentar();
  dekeku.proxy[filePesan.nama] = _dF.makeFlagProxy(renderKomentar);
  const commentForm = document.getElementById("weddingWishForm");
  if (!commentForm) return;
  commentForm.setAttribute("data-aksi", "github-post");
  commentForm.setAttribute("data-dekeku_proxy", true);
  commentForm.setAttribute("data-file", `${filePesan.file}`);
  
  const inputNamaTamu = document.createElement("input");
  inputNamaTamu.type = "hidden";
  inputNamaTamu.name = "nama";
  inputNamaTamu.value = dekeku.params.namaTamu;

  commentForm.appendChild(inputNamaTamu);
}

function renderKomentar() {
  if (!dekeku.dataJson.pesan || !Array.isArray(dekeku.dataJson.pesan)) return;

  const komentarContainer = document.getElementById("comment-container");
  if (!komentarContainer) {
    console.warn("Elemen container komentar tidak ditemukan.");
    return;
  }
  
  const komentarList = dekeku.dataJson.pesan
    .map((tamu, idx) => ({...tamu, _idx: idx}))
    .filter(tamu => tamu.pesan && tamu.pesan.trim() !== "")
    .reverse();
  let loadedCount = 0;
  const batchSize = 5;

  komentarContainer.innerHTML = "";

  const existingBtn = document.getElementById("moreComment");
  if (existingBtn) existingBtn.remove();

  function renderBatch() {
    const end = Math.min(loadedCount + batchSize, komentarList.length);
    for (let i = loadedCount; i < end; i++) {
      const tamu = komentarList[i];
      const item = document.createElement("div");
      item.className = "comment-item aos-init aos-animate";
      item.id = `comment${tamu.id || i}`;
      item.setAttribute("data-aos", "fade-up");
      item.setAttribute("data-aos-duration", "1200");
      item.style.opacity = "1";
      item.style.transitionDuration = "1200ms";

      const nama = tamu.nama || "Tamu";
      const tanggal = formatTanggal(tamu["waktu"]);
      const pesan = tamu.pesan;

      item.innerHTML = `
        <div class="comment-head">
          <h3 class="comment-name">${escapeHtml(nama)}</h3>
          <small class="comment-date">${tanggal}</small>
        </div>
        <div class="comment-body">
          <p class="comment-caption">${escapeHtml(pesan)}</p>
        </div>
      `;

      komentarContainer.appendChild(item);
    }
    loadedCount = end;

    if (loadedCount < komentarList.length) {
      let btn = document.getElementById("moreComment");
      if (!btn) {
        btn = document.createElement("button");
        btn.id = "moreComment";
        btn.className = "comment-loadmore-btn";
        btn.textContent = "Tampilkan lebih banyak";
        komentarContainer.parentNode.appendChild(btn);
        btn.addEventListener("click", function() {
          renderBatch();
          btn.scrollIntoView({behavior: "smooth", block: "end"});
        });
      }
      btn.style.display = "block";
    } else {
      const btn = document.getElementById("moreComment");
      if (btn) btn.style.display = "none";
    }
  }

  renderBatch();
}

function formatTanggal(isoString) {
  if (!isoString) return "-";
  const tanggal = new Date(isoString);
  return tanggal.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}


function showAlert(pesan, status) {
  const alertBox = document.getElementById("alert");
  const alertText = alertBox.querySelector(".alert-text");
  const alertClose = alertBox.querySelector(".alert-close");

  alertBox.className = `alert show ${status}`;
  alertText.textContent = pesan;
  
  if (alertBox._timeoutId) clearTimeout(alertBox._timeoutId);
  
  alertBox._timeoutId = setTimeout(() => {
    closeAlert();
  }, 5000);

  alertClose.onclick = () => {
    closeAlert();
  };
}
_dF.showAlert = showAlert;
window.alert = function(message) {
  showAlert(message, "error");
};

function closeAlert() {
  const alertBox = document.getElementById("alert");
  alertBox.className = "alert hide";
  if (alertBox._timeoutId) {
    clearTimeout(alertBox._timeoutId);
    alertBox._timeoutId = null;
  }
}

export async function initUndangan(){
  dekeku.prosesJs += 1;
  getParams();
  if(typeof dekeku.params.sellerId === "undefined" ){
    dekeku.params.sellerId = 1;
    _dF.writeURLParams(dekeku.params);
  }

  filePesan = {file:`${fileName}.pesan`, nama: "pesan"};
  fileTamu = {file:`${fileName}.tamu`, nama: "tamu", obj:true, filter:{nama: dekeku.params.namaTamu}};
  fileSeller = {file: "data.seller", nama: "seller", obj:true, filter:{id: dekeku.params.sellerId}, repo:{username:"wahyuajismustofa",repo:"dekeku"}};
  _dF.pushUniqueObj(dekeku.daftarJson,"nama",fileTamu,filePesan,fileSeller);
  await _dF.loadAllData();

  if(typeof dekeku.params.namaTamu === "undefined" ){
    dekeku.params.namaTamu = dekeku.dataJson.seller.nama;
    _dF.writeURLParams(dekeku.params);
  }

  gantiIsiClass("nama",dekeku.params.namaTamu);
  dekeku.dataJson.seller.linkWa = `https://wa.me/${dekeku.dataJson.seller.kontak}`;
  _dF.updateDataAtt("dekeku_data_seller", dekeku.dataJson.seller);
  initRSVP();
  initFormKomentar();
  _dF.initDekeku();
  dekeku.prosesJs -= 1;
}


function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function makeLog(vars) {
    if (!Array.isArray(vars)) {
        console.warn("makeLog: parameter harus berupa array");
        return;
    }

    vars.forEach((val, idx) => {
        console.log(`${idx + 1}: `, val);
    });
}

function enterFullscreen(el = document.documentElement) {
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.mozRequestFullScreen) {
    el.mozRequestFullScreen(); // Firefox
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen(); // Safari/Chrome
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen(); // IE/Edge
  } else {
    console.warn("Fullscreen API tidak didukung di browser ini.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const tombol = document.getElementById("startToExplore");
  if (tombol) {
    tombol.addEventListener("click", function () {
      enterFullscreen();
    });
  } else {
    console.warn('Elemen dengan id="startToExplore" tidak ditemukan.');
  }
});