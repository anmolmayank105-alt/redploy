// Manual test for college selection feature
// Run this in browser console on the registration page

console.log('Testing College Selection Feature...');

// Test 1: Check if colleges are loaded
fetch('/api/colleges')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Colleges loaded:', data.length, 'colleges available');
    if (data.length > 0) {
      console.log('Sample college:', data[0].name);
    }
  })
  .catch(error => console.error('❌ Failed to load colleges:', error));

// Test 2: Check form elements exist
const collegeSelect = document.querySelector('select[name="collegeId"]');
const customCollegeInput = document.querySelector('input[name="customCollege"]');

if (collegeSelect) {
  console.log('✅ College dropdown found with', collegeSelect.options.length, 'options');
} else {
  console.log('❌ College dropdown not found');
}

if (customCollegeInput) {
  console.log('✅ Custom college input field found');
} else {
  console.log('❌ Custom college input field not found');
}

// Test 3: Check predefined college option
const netajiOption = Array.from(collegeSelect.options).find(option => 
  option.textContent.includes('Netaji Subhash Engineering College')
);

if (netajiOption) {
  console.log('✅ Netaji Subhash Engineering College option found');
} else {
  console.log('❌ Netaji Subhash Engineering College option not found');
}

// Test 4: Check "Other" option
const otherOption = Array.from(collegeSelect.options).find(option => 
  option.textContent.includes('Other')
);

if (otherOption) {
  console.log('✅ "Other (Type manually)" option found');
} else {
  console.log('❌ "Other (Type manually)" option not found');
}

console.log('College Selection Feature Test Complete');