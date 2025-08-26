import dekeku, { dekekuFunction as _dF } from "https://cdn.jsdelivr.net/gh/wahyuajismustofa/dekeku@f1d529a7f7c401db669f258c045294732b6ff138/assets/js/dekeku.js";
export default dekeku;

export async function init() {
  await _dF.waitUntilTrue(() => dekeku.ready).then(() => {
    dekeku.params = _dF.readURLParams();
    _dF.initDekeku();
    window.showAlert = _dF.showAlert;
  }).catch(
    err => console.error(err.message)
  );
}

export async function initSeller(sellerFilter){
  let fileSeller = {file: "data.seller", nama: "seller", obj:true, filter:{ [Object.keys(sellerFilter)] : sellerFilter[Object.keys(sellerFilter)] }, repo:{username:"wahyuajismustofa",repo:"dekeku"}};
  _dF.pushUniqueObj(dekeku.daftarJson,"nama",fileSeller);
  await _dF.loadAllData();
  await configDataSeller(sellerFilter,fileSeller);
  await _dF.updateDataAtt("dekeku_data_seller", dekeku.dataJson[fileSeller.nama]);
  applyDataParamsToHref();
}

async function configDataSeller(sellerFilter , fileSeller) {
  let sellerSaved = dekeku.dataJson.seller[Object.keys(sellerFilter)];
  let sellerWritten = sellerFilter[Object.keys(sellerFilter)];
  let dataValid = sellerSaved === sellerWritten;
  if(!dataValid){
    sessionStorage.clear();
    let index = dekeku.daftarJson.findIndex(item => item.nama === "seller");
    dekeku.daftarJson[index] = fileSeller;
    delete dekeku.dataJson[fileSeller.nama];
    await _dF.loadAllData();
  }
  dekeku.dataJson[fileSeller.nama] = _dF.flattenWithPrefix(dekeku.dataJson[fileSeller.nama],"sosialMedia");
  dekeku.dataJson[fileSeller.nama].params = encodeUrlSafe(JSON.stringify({sellerId: dekeku.dataJson[fileSeller.nama].id}));
}

function encodeUrlSafe(str) {
  return btoa(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
function applyDataParamsToHref() {
  let selector = 'a[data-params]';
  document.querySelectorAll(selector).forEach(el => {
    const params = el.getAttribute('data-params');
    if (params) {
      const url = new URL(el.getAttribute('href'), window.location.origin);
      url.searchParams.set("d", params);
      el.setAttribute("href", url.toString().replace(window.location.origin, ""));
      el.removeAttribute("data-params");
    }
  });
}
_dF.encodeUrlSafe = encodeUrlSafe;