const FP = {
 get(k,d=[]){try{return JSON.parse(localStorage.getItem(k)) ?? d}catch{return d}},
 set(k,v){localStorage.setItem(k,JSON.stringify(v))},
 user(){return this.get("farmpath_user",null)},
 farms(){return this.get("farmpath_farms",[])},
 activeFarm(){const fs=this.farms(); return fs.find(f=>f.id===this.get("farmpath_activeFarm",null))||fs[0]||null},
 money(n){return new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(Number(n)||0)}
};
function protect(){if(document.body.classList.contains("app-page")&&!FP.user()) location.href="auth.html"}
function logout(){localStorage.removeItem("farmpath_user");location.href="index.html"}
document.addEventListener("DOMContentLoaded",()=>{protect();document.querySelectorAll("#logoutBtn").forEach(b=>b.onclick=logout);document.querySelectorAll("#menuBtn").forEach(b=>b.onclick=()=>document.querySelector(".sidebar").classList.toggle("open"))});