var bg = {
  data: null, 
  hBal: null, 
  hInc: null, 
  hExp: null, 
  hList: null, 
  hForm: null, 
  fID: null,
  fSign: null,
  fTxt: null,
  fAmt: null, 
  init: () => {
    bg.hBal = document.getElementById("balanceAmt");
    bg.hInc = document.getElementById("incomeAmt");
    bg.hExp = document.getElementById("expenseAmt");
    bg.hList = document.getElementById("list");
    bg.hForm = document.getElementById("form");
    bg.fID = document.getElementById("formID");
    bg.fSign = document.getElementById("formSign");
    bg.fTxt = document.getElementById("formTxt");
    bg.fAmt = document.getElementById("formAmt");

    
    bg.entries = localStorage.getItem("entries");
    if (bg.entries == null) {
      bg.entries = [];
    } else {
      bg.entries = JSON.parse(bg.entries);
    }

    
    bg.draw();
  },

  
  toggle: (id) => {
    if (id === false) {
      bg.fID.value = "";
      bg.fSign.value = "-";
      bg.fTxt.value = "";
      bg.fAmt.value = "";
      bg.hForm.classList.remove("show");
    } else {
      if (Number.isInteger(id)) {
        bg.fID.value = id;
        bg.fSign.value = bg.entries[id].s;
        bg.fTxt.value = bg.entries[id].t;
        bg.fAmt.value = bg.entries[id].a;
      }
      bg.hForm.classList.add("show");
    }
  },

  draw: () => {
    let bal = 0,
      inc = 0,
      exp = 0,
      row;

    bg.hList.innerHTML = "";
    bg.entries.forEach((entry, i) => {
      if (entry.s == "+") {
        inc += entry.a;
        bal += entry.a;
      } else {
        exp += entry.a;
        bal -= entry.a;
      }
      row = document.createElement("div");
      row.className = `entry ${entry.s == "-" ? "expense" : "income"}`;
      row.innerHTML = `<div class="eDel" onclick="bg.del(${i})"><i class="fa-regular fa-trash-can"></i></div>
      <div class="eTxt">${entry.t}</div>
      <div class="eAmt">&#8377;${parseFloat(entry.a).toFixed(2)}</div>
      <div class="eEdit" onclick="bg.toggle(${i})"><i class="fa-solid fa-pencil"></i></div>`;
      bg.hList.appendChild(row);
    });

    bg.hBal.innerHTML =
      bal < 0
        ? `-&#8377;${Math.abs(bal).toFixed(2)}`
        : `&#8377;${bal.toFixed(2)}`;
    bg.hInc.innerHTML = `&#8377;${inc.toFixed(2)}`;
    bg.hExp.innerHTML = `&#8377;${exp.toFixed(2)}`;
  },

  save: () => {
    let data = {
      s: bg.fSign.value,
      t: bg.fTxt.value,
      a: parseFloat(bg.fAmt.value),
    };

    if (bg.fID.value == "") {
      bg.entries.push(data);
    } else {
      bg.entries[parseInt(bg.fID.value)] = data;
    }
    localStorage.setItem("entries", JSON.stringify(bg.entries));

    bg.toggle(false);
    bg.draw();
    return false;
    bar.animate(bg.hExp.innerHTML.slice(1) / bg.hInc.innerHTML.slice(1));
  },

  del: (id) => {
    if (confirm("Delete entry?")) {
      bg.entries.splice(id, 1);
      localStorage.setItem("entries", JSON.stringify(bg.entries));
      bg.draw();
    }
  },
};
window.onload = bg.init;

self.addEventListener("install", (evt) => {
  self.skipWaiting();
  evt.waitUntil(
    caches
      .open("JSBudget")
      .then((cache) =>
        cache.addAll([
          "favicon.png",
          "icon-512.png",
          "1-js-budget.html",
          "2-js-budget.js",
          "2-js-budget.css",
        ])
      )
      .catch((err) => console.error(err))
  );
});

self.addEventListener("activate", (evt) => self.clients.claim());

self.addEventListener("fetch", (evt) =>
  evt.respondWith(
    caches.match(evt.request).then((res) => res || fetch(evt.request))
  )
);



var bar = new ProgressBar.SemiCircle(container, {
  strokeWidth: 10,
  color: "cyan",
  trailColor: "rgb(59,59,59)",
  trailWidth: 10,
  easing: "linear",
  duration: 500,
  svgStyle: null,
  text: {
    value: "",
    alignToBottom: false,
  },


  step: (state, bar) => {
    bar.path.setAttribute("stroke", state.color);
    var value = Math.round(bar.value() * 100);
    if (value === 0) {
      bar.setText("");
    } else {
      bar.setText(value + "%");
    }

    bar.text.style.color = state.color;
  },
});
bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
bar.text.style.fontSize = "2rem";


setInterval(function () {
  bar.animate(bg.hExp.innerHTML.slice(1) / bg.hInc.innerHTML.slice(1));
}, 1000);


