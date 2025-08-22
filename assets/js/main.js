import dekeku, { dekekuFunction as _dF } from "https://cdn.jsdelivr.net/gh/wahyuajismustofa/dekeku@e57818d012691c1e2423076d12d194a9812e3c96//assets/js/dekeku.js";
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
  _dF.updateDataAtt("dekeku_data_seller", dekeku.dataJson[fileSeller.nama]);
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
  dekeku.dataJson[fileSeller.nama] = flattenWithPrefix(dekeku.dataJson[fileSeller.nama],"sosialMedia");
  dekeku.dataJson[fileSeller.nama].params = encodeUrlSafe(JSON.stringify({sellerId: dekeku.dataJson[fileSeller.nama].id}));
}

function flattenWithPrefix(data,prefix) {
  let newData = { ...data };
  if (data[prefix]) {
    Object.entries(data[prefix]).forEach(([key, value]) => {
      newData[`${prefix}_${key}`] = value;
    });
  }

  return newData;
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