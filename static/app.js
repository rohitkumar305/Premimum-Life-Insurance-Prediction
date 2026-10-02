// ==============================================================================
//  PREMIUM LIFE INSURANCE PREDICTION - FRONTEND CONTROLLER
// ==============================================================================

// City Lists matching backend configuration
const TIER_1_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"
];

const TIER_2_CITIES = [
  "Jaipur", "Chandigarh", "Indore", "Lucknow", "Patna", "Ranchi", "Visakhapatnam", 
  "Coimbatore", "Bhopal", "Nagpur", "Vadodara", "Surat", "Rajkot", "Jodhpur", 
  "Raipur", "Amritsar", "Varanasi", "Agra", "Dehradun", "Mysore", "Jabalpur", 
  "Guwahati", "Thiruvananthapuram", "Ludhiana", "Nashik", "Allahabad", "Udaipur", 
  "Aurangabad", "Hubli", "Belgaum", "Salem", "Vijayawada", "Tiruchirappalli", 
  "Bhavnagar", "Gwalior", "Dhanbad", "Bareilly", "Aligarh", "Gaya", "Kozhikode", 
  "Warangal", "Kolhapur", "Bilaspur", "Jalandhar", "Noida", "Guntur", "Asansol", 
  "Siliguri"
];

const CITY_ALIASES = {
  "bengaluru": "Bangalore",
  "new delhi": "Delhi",
  "gurugram": "Gurgaon",
  "prayagraj": "Allahabad"
};

// Preset Profiles for quick testing
const PRESETS = {
  executive: {
    age: 32,
    weight: 68.0,
    height: 1.78,
    income_lpa: 26.5,
    smoker: false,
    city: "Mumbai",
    occupation: "private_job"
  },
  senior: {
    age: 69,
    weight: 119.0,
    height: 1.56,
    income_lpa: 2.52,
    smoker: false,
    city: "Jaipur",
    occupation: "retired"
  },
  student: {
    age: 22,
    weight: 109.4,
    height: 1.55,
    income_lpa: 3.34,
    smoker: true,
    city: "Delhi",
    occupation: "student"
  },
  business: {
    age: 58,
    weight: 74.4,
    height: 1.73,
    income_lpa: 45.0,
    smoker: false,
    city: "Pune",
    occupation: "business_owner"
  }
};

// DOM Elements
const form = document.getElementById("prediction-form");
const ageInput = document.getElementById("age");
const weightInput = document.getElementById("weight");
const heightInput = document.getElementById("height");
const incomeInput = document.getElementById("income_lpa");
const smokerInput = document.getElementById("smoker");
const cityInput = document.getElementById("city");
const occupationSelect = document.getElementById("occupation");
const submitBtn = document.getElementById("submit-btn");
const submitBtnText = document.getElementById("submit-btn-text");
const submitSpinner = document.getElementById("submit-spinner");
const errorBanner = document.getElementById("error-banner");

// Live Preview DOM Elements
const liveBmiVal = document.getElementById("live-bmi-val");
const liveBmiBadge = document.getElementById("live-bmi-badge");
const liveBmiFill = document.getElementById("live-bmi-fill");
const liveRiskVal = document.getElementById("live-risk-val");
const liveRiskBadge = document.getElementById("live-risk-badge");
const liveAgeGroupVal = document.getElementById("live-agegroup-val");
const liveCityTierVal = document.getElementById("live-citytier-val");

// Result Panel Elements
const placeholderState = document.getElementById("placeholder-state");
const resultCard = document.getElementById("result-card");
const resultHero = document.getElementById("result-hero");
const resultIcon = document.getElementById("result-icon");
const resultTierTitle = document.getElementById("result-tier-title");
const resultTierDesc = document.getElementById("result-tier-desc");
const resultTableBmi = document.getElementById("res-bmi");
const resultTableRisk = document.getElementById("res-risk");
const resultTableAgeGroup = document.getElementById("res-agegroup");
const resultTableCityTier = document.getElementById("res-citytier");
const resultTableIncome = document.getElementById("res-income");
const resultTableOccupation = document.getElementById("res-occupation");

// Helper: Normalize City
function normalizeCity(cityRaw) {
  if (!cityRaw) return "";
  const cleaned = cityRaw.trim().toLowerCase();
  if (CITY_ALIASES[cleaned]) return CITY_ALIASES[cleaned];
  return cityRaw.trim().replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

// Helper: Calculate BMI
function calculateBmi(weight, height) {
  if (!weight || !height || height <= 0) return 0;
  return weight / (height * height);
}

// Helper: Get City Tier
function getCityTier(cityRaw) {
  const normalized = normalizeCity(cityRaw);
  if (TIER_1_CITIES.includes(normalized)) return 1;
  if (TIER_2_CITIES.includes(normalized)) return 2;
  return 3;
}

// Helper: Get Age Group
function getAgeGroup(age) {
  if (age < 25) return "young";
  if (age < 45) return "adult";
  if (age < 60) return "middle_aged";
  return "senior";
}

// Helper: Get Lifestyle Risk
function getLifestyleRisk(smoker, bmi) {
  if (smoker && bmi > 30) return "high";
  if (smoker || bmi > 27) return "medium";
  return "low";
}

// Update Live Biometric Gauges
function updateLiveInsights() {
  const age = parseInt(ageInput.value, 10) || 0;
  const weight = parseFloat(weightInput.value) || 0;
  const height = parseFloat(heightInput.value) || 0;
  const smoker = smokerInput.checked;
  const city = cityInput.value;

  // 1. BMI calculation
  const bmi = calculateBmi(weight, height);
  if (bmi > 0) {
    liveBmiVal.textContent = bmi.toFixed(1);
    let category = "Normal";
    let color = "#10b981";
    let pct = Math.min(100, Math.max(10, ((bmi - 15) / 25) * 100));

    if (bmi < 18.5) {
      category = "Underweight";
      color = "#38bdf8";
    } else if (bmi <= 24.9) {
      category = "Normal";
      color = "#10b981";
    } else if (bmi <= 29.9) {
      category = "Overweight";
      color = "#f59e0b";
    } else {
      category = "Obese";
      color = "#f43f5e";
    }

    liveBmiBadge.textContent = category;
    liveBmiBadge.style.color = color;
    liveBmiBadge.style.background = `${color}20`;
    liveBmiFill.style.width = `${pct}%`;
    liveBmiFill.style.backgroundColor = color;
  } else {
    liveBmiVal.textContent = "--";
    liveBmiBadge.textContent = "Awaiting input";
    liveBmiBadge.style.color = "#94a3b8";
    liveBmiBadge.style.background = "rgba(255,255,255,0.06)";
    liveBmiFill.style.width = "0%";
  }

  // 2. Lifestyle Risk
  const risk = getLifestyleRisk(smoker, bmi);
  liveRiskVal.textContent = risk.toUpperCase();
  if (risk === "low") {
    liveRiskBadge.textContent = "Minimal Risk";
    liveRiskBadge.style.color = "#10b981";
    liveRiskBadge.style.background = "rgba(16, 185, 129, 0.15)";
  } else if (risk === "medium") {
    liveRiskBadge.textContent = "Moderate Risk";
    liveRiskBadge.style.color = "#f59e0b";
    liveRiskBadge.style.background = "rgba(245, 158, 11, 0.15)";
  } else {
    liveRiskBadge.textContent = "Elevated Risk";
    liveRiskBadge.style.color = "#f43f5e";
    liveRiskBadge.style.background = "rgba(244, 63, 94, 0.15)";
  }

  // 3. Age Group
  if (age > 0) {
    const group = getAgeGroup(age);
    const labels = {
      young: "Young (< 25)",
      adult: "Adult (25-44)",
      middle_aged: "Mid-Age (45-59)",
      senior: "Senior (60+)"
    };
    liveAgeGroupVal.textContent = labels[group] || group;
  } else {
    liveAgeGroupVal.textContent = "--";
  }

  // 4. City Tier
  if (city && city.trim().length > 0) {
    const tier = getCityTier(city);
    liveCityTierVal.textContent = `Tier ${tier}`;
  } else {
    liveCityTierVal.textContent = "--";
  }
}

// Preset Loader
function loadPreset(presetKey) {
  const p = PRESETS[presetKey];
  if (!p) return;

  ageInput.value = p.age;
  weightInput.value = p.weight;
  heightInput.value = p.height;
  incomeInput.value = p.income_lpa;
  smokerInput.checked = p.smoker;
  cityInput.value = p.city;
  occupationSelect.value = p.occupation;

  updateLiveInsights();
  hideError();
}

// Error Handling
function showError(msg) {
  errorBanner.textContent = msg;
  errorBanner.style.display = "block";
}

function hideError() {
  errorBanner.style.display = "none";
}

// Display Prediction Result
function renderResult(category, inputData, calculated) {
  placeholderState.style.display = "none";
  resultCard.style.display = "block";

  resultHero.className = `result-hero ${category.toLowerCase()}`;
  resultTierTitle.className = `result-tier-title ${category.toLowerCase()}`;
  resultTierTitle.textContent = `${category} Premium`;

  if (category === "Low") {
    resultIcon.textContent = "🛡️";
    resultTierDesc.textContent = "Optimal risk tier. Favorable age, biometrics, and economic profile.";
  } else if (category === "Medium") {
    resultIcon.textContent = "⚖️";
    resultTierDesc.textContent = "Standard risk tier. Moderate risk factors detected across lifestyle or demographics.";
  } else {
    resultIcon.textContent = "⚠️";
    resultTierDesc.textContent = "Higher risk category. Premium calculated with consideration for elevated risk factors.";
  }

  // Breakdown values
  resultTableBmi.textContent = `${calculated.bmi.toFixed(1)} (${calculated.lifestyleRisk.toUpperCase()} Risk)`;
  resultTableRisk.textContent = calculated.lifestyleRisk.toUpperCase();
  resultTableAgeGroup.textContent = calculated.ageGroup;
  resultTableCityTier.textContent = `Tier ${calculated.cityTier} (${calculated.normalizedCity})`;
  resultTableIncome.textContent = `₹ ${inputData.income_lpa} Lakhs/Yr`;
  resultTableOccupation.textContent = inputData.occupation.replace(/_/g, " ").toUpperCase();

  // Scroll smooth to result if mobile
  if (window.innerWidth < 900) {
    resultCard.scrollIntoView({ behavior: "smooth" });
  }
}

// Form Submission Event
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();

  const age = parseInt(ageInput.value, 10);
  const weight = parseFloat(weightInput.value);
  const height = parseFloat(heightInput.value);
  const income_lpa = parseFloat(incomeInput.value);
  const smoker = smokerInput.checked;
  const city = cityInput.value.trim();
  const occupation = occupationSelect.value;

  if (!city) {
    showError("Please enter a valid city name.");
    return;
  }

  const payload = {
    age,
    weight,
    height,
    income_lpa,
    smoker,
    city,
    occupation
  };

  // Button loading state
  submitBtn.disabled = true;
  submitBtnText.textContent = "Running AI Prediction...";
  submitSpinner.style.display = "inline-block";

  try {
    const response = await fetch("/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMsg = "Prediction request failed.";
      if (errorData.detail) {
        if (Array.isArray(errorData.detail)) {
          errorMsg = errorData.detail.map(d => `${d.loc.slice(-1)}: ${d.msg}`).join(", ");
        } else {
          errorMsg = errorData.detail;
        }
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    const bmi = calculateBmi(weight, height);
    const calculated = {
      bmi,
      lifestyleRisk: getLifestyleRisk(smoker, bmi),
      ageGroup: getAgeGroup(age),
      cityTier: getCityTier(city),
      normalizedCity: normalizeCity(city)
    };

    renderResult(data.premium_category, payload, calculated);

  } catch (err) {
    showError(err.message || "An unexpected error occurred while connecting to the server.");
  } finally {
    submitBtn.disabled = false;
    submitBtnText.textContent = "Predict Insurance Premium";
    submitSpinner.style.display = "none";
  }
});

// Setup Real-time Event Listeners
[ageInput, weightInput, heightInput, smokerInput, cityInput].forEach((input) => {
  input.addEventListener("input", updateLiveInsights);
  input.addEventListener("change", updateLiveInsights);
});

// Check API Health on Page Load
async function checkApiHealth() {
  try {
    const res = await fetch("/health");
    if (res.ok) {
      const statusBadge = document.getElementById("api-status-badge");
      if (statusBadge) {
        statusBadge.innerHTML = '<span class="pulse-dot"></span> API Online';
      }
    }
  } catch (e) {
    // If /health not found, check /
    try {
      const res2 = await fetch("/");
      if (res2.ok) {
        const statusBadge = document.getElementById("api-status-badge");
        if (statusBadge) {
          statusBadge.innerHTML = '<span class="pulse-dot"></span> API Online';
        }
      }
    } catch (_) {}
  }
}

// Initialize on Load with Default Profile
window.addEventListener("DOMContentLoaded", () => {
  loadPreset("executive");
  checkApiHealth();
});
