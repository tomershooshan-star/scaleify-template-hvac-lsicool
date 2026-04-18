/* Scaleify widgets: cookie consent + instant quote side panel + chatbot.
   Self-contained vanilla JS. Injects DOM on load. */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    mountCookie();
    mountQuote();
    mountChat();
  });

  // ==================== COOKIE CONSENT ====================
  function mountCookie() {
    if (localStorage.getItem("sc_cookie_decision")) return;
    var html =
      '<div class="sc-cookie" id="sc-cookie" role="dialog" aria-label="Cookie consent">' +
        '<div class="sc-cookie__icon">🍪</div>' +
        '<div class="sc-cookie__text">We use cookies to improve your experience and measure site performance. See our <a href="#">Privacy Policy</a>.</div>' +
        '<div class="sc-cookie__btns">' +
          '<button class="sc-btn sc-btn--ghost" id="sc-cookie-reject">Reject</button>' +
          '<button class="sc-btn sc-btn--primary" id="sc-cookie-accept">Accept</button>' +
        '</div>' +
      '</div>';
    document.body.insertAdjacentHTML("beforeend", html);

    var el = document.getElementById("sc-cookie");
    setTimeout(function () { el.classList.add("sc-show"); }, 800);

    function decide(choice) {
      localStorage.setItem("sc_cookie_decision", choice);
      el.classList.remove("sc-show");
      setTimeout(function () { el.remove(); }, 500);
    }
    document.getElementById("sc-cookie-accept").addEventListener("click", function () { decide("accept"); });
    document.getElementById("sc-cookie-reject").addEventListener("click", function () { decide("reject"); });
  }

  // ==================== INSTANT QUOTE ====================
  function mountQuote() {
    var html =
      '<button class="sc-quote-tab" id="sc-quote-tab" aria-label="Open instant quote form">' +
        '<span class="sc-quote-tab__dot"></span>Instant Quote' +
      '</button>' +
      '<div class="sc-quote-overlay" id="sc-quote-overlay"></div>' +
      '<aside class="sc-quote-panel" id="sc-quote-panel" role="dialog" aria-label="Instant quote form">' +
        '<div class="sc-quote-panel__header">' +
          '<div>' +
            '<div class="sc-quote-panel__title">Get an Instant Quote</div>' +
            '<div class="sc-quote-panel__subtitle">We\'ll text you back within 15 minutes</div>' +
          '</div>' +
          '<button class="sc-quote-panel__close" id="sc-quote-close" aria-label="Close">✕</button>' +
        '</div>' +
        '<form class="sc-quote-form" id="sc-quote-form">' +
          '<div class="sc-field"><label>Your Name</label><input name="name" type="text" required placeholder="Jane Smith" /></div>' +
          '<div class="sc-field"><label>Phone</label><input name="phone" type="tel" required placeholder="(555) 000-0000" /></div>' +
          '<div class="sc-field"><label>Email</label><input name="email" type="email" placeholder="jane@email.com" /></div>' +
          '<div class="sc-field"><label>Service Needed</label>' +
            '<select name="service"><option>AC Repair</option><option>AC Installation</option><option>Heating / Furnace</option><option>Duct Cleaning</option><option>Maintenance Tune-Up</option><option>Emergency Service</option><option>Other</option></select>' +
          '</div>' +
          '<div class="sc-field"><label>Describe the Issue</label><textarea name="message" rows="3" required placeholder="What\'s going on?"></textarea></div>' +
          '<button type="submit" class="sc-quote-submit" id="sc-quote-submit">Get My Free Quote</button>' +
          '<div class="sc-quote-note">By submitting, you agree to receive a call or text from us. Message & data rates may apply.</div>' +
        '</form>' +
      '</aside>';
    document.body.insertAdjacentHTML("beforeend", html);

    var tab = document.getElementById("sc-quote-tab");
    var overlay = document.getElementById("sc-quote-overlay");
    var panel = document.getElementById("sc-quote-panel");
    var close = document.getElementById("sc-quote-close");
    var form = document.getElementById("sc-quote-form");
    var submit = document.getElementById("sc-quote-submit");

    function open() { overlay.classList.add("sc-show"); panel.classList.add("sc-show"); }
    function hide() { overlay.classList.remove("sc-show"); panel.classList.remove("sc-show"); }

    tab.addEventListener("click", open);
    overlay.addEventListener("click", hide);
    close.addEventListener("click", hide);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      submit.textContent = "Sending...";
      submit.disabled = true;
      // Placeholder webhook — swap to real endpoint when client onboards
      setTimeout(function () {
        submit.textContent = "Sent! We'll text you shortly.";
        setTimeout(function () {
          form.reset();
          submit.textContent = "Get My Free Quote";
          submit.disabled = false;
          hide();
        }, 2000);
      }, 800);
    });
  }

  // ==================== CHATBOT ====================
  function mountChat() {
    var html =
      '<button class="sc-chat-btn" id="sc-chat-btn" aria-label="Open chat">' +
        '<span class="sc-chat-btn__pulse"></span>💬' +
      '</button>' +
      '<div class="sc-chat-panel" id="sc-chat-panel" role="dialog" aria-label="Chat support">' +
        '<div class="sc-chat-header">' +
          '<div class="sc-chat-header__title">How can we help?</div>' +
          '<div class="sc-chat-header__subtitle"><span class="sc-chat-header__dot"></span>Typically replies in minutes</div>' +
        '</div>' +
        '<div class="sc-chat-body" id="sc-chat-body">' +
          '<div class="sc-chat-msg sc-chat-msg--bot">Hey! 👋 I\'m the BrightAir assistant. What brings you in today?</div>' +
        '</div>' +
        '<div class="sc-chat-quick">' +
          '<button data-msg="I need emergency AC repair">Emergency AC</button>' +
          '<button data-msg="Tune-up pricing?">Tune-up pricing</button>' +
          '<button data-msg="Book a free estimate">Free estimate</button>' +
          '<button data-msg="Hours?">Hours</button>' +
        '</div>' +
        '<div class="sc-chat-input">' +
          '<input type="text" id="sc-chat-input" placeholder="Type your message..." />' +
          '<button id="sc-chat-send" aria-label="Send">→</button>' +
        '</div>' +
      '</div>';
    document.body.insertAdjacentHTML("beforeend", html);

    var btn = document.getElementById("sc-chat-btn");
    var panel = document.getElementById("sc-chat-panel");
    var body = document.getElementById("sc-chat-body");
    var input = document.getElementById("sc-chat-input");
    var send = document.getElementById("sc-chat-send");

    btn.addEventListener("click", function () {
      panel.classList.toggle("sc-show");
      if (panel.classList.contains("sc-show")) input.focus();
    });

    function addMsg(text, who) {
      var el = document.createElement("div");
      el.className = "sc-chat-msg sc-chat-msg--" + who;
      el.textContent = text;
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
    }

    function reply(userText) {
      var lower = userText.toLowerCase();
      var r;
      if (/emergency|urgent|broken|not working/.test(lower)) r = "Got it — 24/7 emergency team is dispatched fast. Call us at the number up top or share your address here and a tech will be in touch.";
      else if (/price|cost|tune.?up|estimate|quote/.test(lower)) r = "Tune-ups start at $49 this month. For a full quote, tap the orange 'Instant Quote' tab on the right and we'll text you within 15 min.";
      else if (/hour|open|schedule|when/.test(lower)) r = "Mon–Sat 7am–9pm. Emergency service is 24/7, 365.";
      else if (/book|schedule|appointment/.test(lower)) r = "Awesome — click 'Instant Quote' on the right to book, or call us directly. We confirm within 15 minutes during business hours.";
      else r = "Thanks — a real human will follow up within a few minutes. In the meantime, feel free to tap 'Instant Quote' for faster service.";
      setTimeout(function () { addMsg(r, "bot"); }, 600);
    }

    function sendMsg(text) {
      if (!text || !text.trim()) return;
      addMsg(text.trim(), "user");
      input.value = "";
      reply(text.trim());
    }

    send.addEventListener("click", function () { sendMsg(input.value); });
    input.addEventListener("keypress", function (e) { if (e.key === "Enter") sendMsg(input.value); });
    document.querySelectorAll(".sc-chat-quick button").forEach(function (b) {
      b.addEventListener("click", function () { sendMsg(b.dataset.msg); });
    });
  }
})();
