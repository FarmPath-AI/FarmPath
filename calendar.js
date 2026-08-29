document.addEventListener("DOMContentLoaded",()=>{
 const f=FP.activeFarm();if(!f)return;calendarEmpty.classList.add("hidden");calendarContent.classList.remove("hidden");calendarFarm.textContent=f.name;calendarCrop.textContent=`${f.crop} · planted ${new Date(f.plantingDate).toLocaleDateString("en-NG")} · ${f.system}`;
 const items=[
 ["1","Land Preparation","Clear and prepare the field. Use practices appropriate to your soil, terrain and local guidance."],
 ["2","Seed & Planting","Confirm seed quality and plant using crop-specific spacing and timing guidance."],
 ["3","Establishment","Monitor germination, replace gaps where needed and keep early records."],
 ["4","Crop Management","Plan weeding, nutrient activities and regular pest and disease scouting."],
 ["5","Harvest Preparation","Monitor crop maturity and prepare labour, drying and storage arrangements."],
 ["6","Harvest & Storage","Harvest at suitable maturity and follow crop-specific post-harvest guidance."]
 ];
 timeline.innerHTML=items.map((x,i)=>`<div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-card"><span class="pill">STAGE ${x[0]}</span><h3>${x[1]}</h3><p>${x[2]}</p></div></div>`).join("");
});