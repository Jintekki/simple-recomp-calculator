#!/usr/bin/env node

const prompt = require("prompt-sync")({ sigint: true });

let weightInPounds,
  weightInKilograms,
  bodyFatPercentage,
  leanMassPercentage,
  leanBodyMassInPounds,
  leanBodyMassInKilograms,
  heightInInches,
  heightInCentimeters,
  age,
  sex,
  basalMetablicRate,
  experienceLevel,
  activityMultiplier,
  primaryGoal,
  calorieGoal,
  proteinIntake,
  caloriesFromProtein,
  fatIntakePercentage,
  fatIntake,
  caloriesFromFat,
  remainingCalories,
  carbIntake;

/* Part 1: Weight and Body Fat Percentage */
console.log(
  "\nWelcome to Jintekki's Macro Calculator Tool for Body Recomposition. This tool will help you calculate your macros and calorie goals for body recomposition. A summary and list of principles to abide by will be provided at the end. Let's proceed to part 1 of 10, getting your weight and body fat percentage."
);

[weightInPounds, weightInKilograms] = getWeight();
displayStats();

/* Part 2: LBM */
bodyFatPercentage = getBodyFatPercentage();
leanMassPercentage = 100 - bodyFatPercentage;
leanBodyMassInPounds = weightInPounds * (leanMassPercentage / 100);
leanBodyMassInKilograms = weightInKilograms * (leanMassPercentage / 100);
displayStats();

/* Part 3: BMR */
console.log(
  "\nPart 2 was calculating your Lean Body Mass (LBM), which we've already done. We will now move on to part 3 of 10, calcuting your Basal Metabolic Rate (BMR) using the Mifflin St. Jeor Formula. For this formula, we're going to need your height, age, and sex."
);

[heightInInches, heightInCentimeters] = getHeight();
displayStats();

age = getAge();
displayStats();

sex = getSex();
basalMetablicRate =
  10 * weightInKilograms +
  6.25 * heightInCentimeters -
  5 * age +
  (sex === "MALE" ? 5 : -161);
displayStats();

/* Part 4: History, Goals, and Caloric Targets */
console.log(
  "\nYour Basal Metabolic Rate (BMR) is a prediction of your maintanence calories if you were to do nothing all day. Now it's time for us to calculate your actual calorie goals. To do this, we're going to have to estimate your general activity, your experience level, and your goals. This is part 4 of 10."
);

experienceLevel = getExperienceLevel();
displayStats();

activityMultiplier = getActivityMultiplier();
displayStats();

primaryGoal = getPrimaryGoal();
calorieGoal = calculateCalorieGoal(
  experienceLevel,
  activityMultiplier,
  primaryGoal,
  basalMetablicRate
);
proteinIntake = calculateProteinIntake(
  bodyFatPercentage,
  leanBodyMassInPounds,
  sex
);
caloriesFromProtein = proteinIntake * 4;
fatIntakePercentage = calculateFatPercentage(bodyFatPercentage);
caloriesFromFat = (fatIntakePercentage / 100) * calorieGoal;
fatIntake = caloriesFromFat / 9;
remainingCalories = calorieGoal - caloriesFromProtein - caloriesFromFat;
carbIntake = remainingCalories / 4;
displayStats();

console.log(
  "\nThe rest of the steps were automatically calculated based on your answers. Here are your final macros:"
);

console.log(`\nCalorie Goal: ${calorieGoal.toFixed(2)} kcal`);
console.log(`Protein: ${proteinIntake.toFixed(2)} g`);
console.log(`Fat: ${fatIntake.toFixed(2)} g`);
console.log(`Carbs: ${carbIntake.toFixed(2)} g`);

// This function displays global variables and is not is not pure.
function displayStats() {
  weightInPounds &&
    weightInKilograms &&
    console.log(
      `\nWeight: ${weightInPounds.toFixed(2)} lbs (${weightInKilograms.toFixed(
        2
      )} kgs)`
    );
  bodyFatPercentage &&
    leanMassPercentage &&
    leanBodyMassInPounds &&
    leanBodyMassInKilograms &&
    console.log(
      `Body Fat Percentage: ${bodyFatPercentage.toFixed(
        2
      )}% \nLean Mass Percentage: ${leanMassPercentage.toFixed(
        2
      )}% \nLean Body Mass (LBM): ${leanBodyMassInPounds.toFixed(
        2
      )} lbs (${leanBodyMassInKilograms.toFixed(2)} kgs)`
    );
  heightInInches &&
    heightInCentimeters &&
    console.log(
      `Height: ${Math.floor(heightInInches / 12)} ft ${
        heightInInches % 12
      } in (${heightInCentimeters.toFixed(2)} cm)`
    );
  age && console.log(`Age: ${age}`);
  sex && console.log(`Sex: ${sex}`);
  basalMetablicRate &&
    console.log(
      `Basal Metabolic Rate (BMR): ${basalMetablicRate.toFixed(2)} kcal`
    );
  experienceLevel && console.log(`Experience level: ${experienceLevel}`);
  activityMultiplier &&
    console.log(`Activity multiplier: ${activityMultiplier.toFixed(2)}`);
  activityMultiplier &&
    basalMetablicRate &&
    console.log(
      `Predicted Maintenance Calories: ${(
        basalMetablicRate * activityMultiplier
      ).toFixed(2)}`
    );
  primaryGoal && console.log(`Primary goal: ${primaryGoal}`);
  calorieGoal && console.log(`Calorie goal: ${calorieGoal.toFixed(2)} kcal`);
  proteinIntake &&
    console.log(
      `Protein Intake: ${proteinIntake.toFixed(
        2
      )} g \nCalories From Protein: ${caloriesFromProtein.toFixed(2)} kcal`
    );
  fatIntakePercentage &&
    console.log(
      `Percentage of Calories from Fat: ${fatIntakePercentage.toFixed(
        2
      )}% \nFat Intake: ${fatIntake.toFixed(
        2
      )} g \nCalories from Fat: ${caloriesFromFat.toFixed(2)} kcal`
    );
}

function getPrimaryGoal() {
  let primaryGoal;
  let response = "";
  let confirmed = false;
  console.log("");
  while (!(primaryGoal && confirmed)) {
    console.log("The following are the primary goals to choose from:");
    console.log("1) Lose body fat");
    console.log("2) Maintain body fat percentage");
    console.log("3) Gain muscle mass");
    response = prompt(
      "What is your PRIMARY goal, based on the list above? (1-3):"
    );
    if (response === "1" || response.toUpperCase() === "LOSE BODY FAT") {
      primaryGoal = "LOSE BODY FAT";
    } else if (
      response === "2" ||
      response.toUpperCase() === "MAINTAIN BODY FAT PERCENTAGE"
    ) {
      primaryGoal = "MAINTAIN BODY FAT PERCENTAGE";
    } else if (
      response === "3" ||
      response.toUpperCase() === "GAIN MUSCLE MASS"
    ) {
      primaryGoal = "GAIN MUSCLE MASS";
    } else {
      console.log("Invalid response. Please try again.");
    }
    if (primaryGoal) {
      response = prompt(
        `Your goal is to ${primaryGoal.toLowerCase()}. Is this correct? (y/n): `
      );
      if (
        response.toUpperCase() === "Y" ||
        response.toUpperCase() === "YES" ||
        response === ""
      ) {
        confirmed = true;
      }
    }
  }
  return primaryGoal;
}

function getWeight() {
  let weightInPounds;
  let weightInKilograms;
  let response = "";
  let confirmed = false;
  console.log("");
  while (!(weightInPounds && weightInKilograms && confirmed)) {
    response = prompt(
      "Would you like to input your body weight in pounds (1) or kilograms (2)? (1-2): "
    );
    if (
      response === "1" ||
      response[0].toLowerCase() === "p" ||
      response.toLowerCase() === "lb"
    ) {
      response = prompt("Please enter your body weight in pounds (lb): ");
      weightInPounds = parseFloat(response);
      weightInKilograms = weightInPounds / 2.20462262;
    }
    if (
      response === "2" ||
      response[0].toLowerCase() === "k" ||
      response.toLowerCase() === "kg"
    ) {
      response = prompt("Please enter your body weight in kilograms (kg): ");
      weightInKilograms = parseFloat(response);
      weightInPounds = weightInPounds * 2.20462262;
    }
    if (weightInPounds && weightInKilograms) {
      response = prompt(
        `Your weight is to ${weightInPounds.toFixed(
          2
        )} lbs (${weightInKilograms.toFixed(2)} kg). Is this correct? (y/n): `
      );
      if (
        response.toUpperCase() === "Y" ||
        response.toUpperCase() === "YES" ||
        response === ""
      ) {
        confirmed = true;
      }
    }
  }
  return [weightInPounds, weightInKilograms];
}

function getBodyFatPercentage() {
  let bodyFatPercentage;
  let response = "";
  let confirmed = false;
  console.log("");
  while (!(bodyFatPercentage && confirmed)) {
    response = prompt("What is your body fat percentage?: ");
    if (1 < parseFloat(response) && parseFloat(response) < 99) {
      bodyFatPercentage = parseFloat(response);
      response = prompt(
        `Your body fat percentage is ${bodyFatPercentage}%. Is this correct? (y/n): `
      );
      if (
        response.toUpperCase() === "Y" ||
        response.toUpperCase() === "YES" ||
        response === ""
      ) {
        confirmed = true;
      }
    } else {
      console.log("Invalid input. Please try again.");
    }
  }
  return bodyFatPercentage;
}

function getHeight() {
  let heightInInches;
  let heightInCentimeters;
  let response = "";
  let confirmed = false;
  console.log("");
  while (!(heightInInches && heightInCentimeters && confirmed)) {
    response = prompt(
      "Would you like to input your height in 1) inches or 2) centimeters? (1-2): "
    );
    if (response === "1" || response[0].toLowerCase() === "inches") {
      response = prompt("Please enter your height in inches (in): ");
      heightInInches = parseFloat(response);
      heightInCentimeters = heightInInches * 2.54;
    }
    if (response === "2" || response[0].toLowerCase() === "centimeters") {
      response = prompt("Please enter your height in centimeters (cm): ");
      heightInCentimeters = parseFloat(response);
      heightInInches = heightInCentimeters / 2.54;
    }
    if (heightInInches && heightInCentimeters) {
      response = prompt(
        `Your height is to ${heightInInches.toFixed(
          2
        )} in (${heightInCentimeters.toFixed(2)} cm). Is this correct? (y/n): `
      );
      if (
        response.toUpperCase() === "Y" ||
        response.toUpperCase() === "YES" ||
        response === ""
      ) {
        confirmed = true;
      }
    }
  }
  return [heightInInches, heightInCentimeters];
}

function getAge() {
  let age;
  let response = "";
  let confirmed = false;
  console.log("");
  while (!(age && confirmed)) {
    response = prompt("How old are you?: ");
    if (1 < parseFloat(response) && parseFloat(response) < 99) {
      age = parseFloat(response);
      response = prompt(`Your age is ${age}. Is this correct? (y/n): `);
      if (
        response.toUpperCase() === "Y" ||
        response.toUpperCase() === "YES" ||
        response === ""
      ) {
        confirmed = true;
      }
    } else {
      console.log("Invalid input. Please try again.");
    }
  }
  return age;
}

function getSex() {
  let sex;
  let response = "";
  let confirmed = false;
  console.log("");
  while (!(sex && confirmed)) {
    response = prompt("Are you 1) male or 2) female? (1-2): ");
    if (response === "1" || response === "male" || response === "m") {
      sex = "MALE";
    } else if (response === "2" || response === "female" || response === "f") {
      sex = "FEMALE";
    } else {
      console.log("Invalid input. Please try again.");
    }

    if (sex) {
      response = prompt(
        `Your sex is ${sex.toLowerCase()}. Is this correct? (y/n): `
      );
      if (
        response.toUpperCase() === "Y" ||
        response.toUpperCase() === "YES" ||
        response === ""
      ) {
        confirmed = true;
      }
    }
  }
  return sex;
}

function getExperienceLevel() {
  let experienceLevel;
  let response = "";
  let confirmed = false;
  console.log("");
  while (!(experienceLevel && confirmed)) {
    console.log(
      "The following are rough classifications of experience levels:"
    );
    console.log(
      "1) Beginner: 0 - 2 years of serious lifting/resistance training. Making progressive overload gains on a week to week basis and significant visual chanages month to month."
    );
    console.log(
      "2) Intermediate: ~ 2 - 5 years of serious lifting/resistance training. Able to progressively overload on a month to month basis. Physique progress is evident every couple of months."
    );
    console.log(
      "3) Advanced: ~ 5+ years of serious lifting/resistance training. Takes multiple months or even years to see visual progress and ability to overload lifts is much more difficult.s"
    );
    response = prompt(
      "Based on the options above, what is your experience level? (1-3): "
    );
    if (response === "1" || response[0].toUpperCase === "B") {
      experienceLevel = "BEGINNER";
    } else if (response === "2" || response[0].toUpperCase === "I") {
      experienceLevel = "INTERMEDIATE";
    } else if (response === "3" || response[0].toUpperCase === "A") {
      experienceLevel = "ADVANCED";
    } else {
      console.log("Invalid input. Please try again.");
    }

    if (experienceLevel) {
      response = prompt(
        `Your experience level is ${experienceLevel.toLowerCase()}. Is this correct? (y/n): `
      );
      if (
        response.toUpperCase() === "Y" ||
        response.toUpperCase() === "YES" ||
        response === ""
      ) {
        confirmed = true;
      }
    }
  }
  return experienceLevel;
}

function getActivityMultiplier() {
  let activityMultiplier;
  let response = "";
  let confirmed = false;
  console.log("");
  while (!(experienceLevel && confirmed)) {
    console.log(
      "The following are rough classifications of activity multipliers. These all assume you train between 3 - 6 times per week regularly. Select the number between 1.2 and 2.2 that BEST describes your situation. The descriptions are only examples:"
    );
    console.log(
      "1.2 - 1.5) Sedentary: Works a desk job, very little activity outside of lifting."
    );
    console.log(
      "1.5 - 1.8) Lightly Active: Works a desk job, takes pet for a walk most days in addition to lifting."
    );
    console.log(
      "1.8 - 2.0) Moderatley Active: Works as a full-time waitress, ocasionally plays tennis in addition to lifting."
    );
    console.log(
      "2.0 - 2.2) Highly Active: Works as a construction worker, regular hiking in addition to lifting."
    );
    response = prompt(
      "Based on the options above, what is your activity multiplier? (1.2 - 2.2): "
    );
    if (
      Number.parseFloat(response) >= 1.2 &&
      Number.parseFloat(response) <= 2.2
    ) {
      activityMultiplier = Number.parseFloat(response);
    } else {
      console.log("Invalid input. Please try again.");
    }

    if (activityMultiplier) {
      response = prompt(
        `Your activity multipler is ${activityMultiplier}. Is this correct? (y/n): `
      );
      if (
        response.toUpperCase() === "Y" ||
        response.toUpperCase() === "YES" ||
        response === ""
      ) {
        confirmed = true;
      }
    }
  }
  return activityMultiplier;
}

function calculateCalorieGoal(
  experienceLevel,
  activityMultiplier,
  primaryGoal,
  basalMetablicRate
) {
  if (experienceLevel === "BEGINNER") {
    if (primaryGoal === "LOSE BODY FAT") {
      return basalMetablicRate * activityMultiplier * 0.8;
    }
    if (primaryGoal === "MAINTAIN BODY FAT PERCENTAGE") {
      return basalMetablicRate * activityMultiplier;
    }
    if (primaryGoal === "GAIN MUSCLE MASS") {
      return basalMetablicRate * activityMultiplier * 1.25;
    }
  }
  if (experienceLevel === "INTERMEDIATE") {
    if (primaryGoal === "LOSE BODY FAT") {
      return basalMetablicRate * activityMultiplier * 0.8;
    }
    if (primaryGoal === "MAINTAIN BODY FAT PERCENTAGE") {
      return basalMetablicRate * activityMultiplier;
    }
    if (primaryGoal === "GAIN MUSCLE MASS") {
      return basalMetablicRate * activityMultiplier * 1.15;
    }
  }
  if (experienceLevel === "ADVANCED") {
    if (primaryGoal === "LOSE BODY FAT") {
    }
    if (primaryGoal === "MAINTAIN BODY FAT PERCENTAGE") {
    }
    if (primaryGoal === "GAIN MUSCLE MASS") {
    }
  }
  if (experienceLevel === "DETRAINED") {
    if (primaryGoal === "LOSE BODY FAT") {
    }
    if (primaryGoal === "MAINTAIN BODY FAT PERCENTAGE") {
    }
    if (primaryGoal === "GAIN MUSCLE MASS") {
    }
  }
}

function calculateProteinIntake(bodyFatPercentage, leanBodyMassInPounds, sex) {
  let proteinPerLeanBodyMass;
  if (sex === "FEMALE") {
    proteinPerLeanBodyMass = 0.0125 * bodyFatPercentage + 1.1;
    return proteinPerLeanBodyMass * leanBodyMassInPounds;
  }
  if (sex === "MALE") {
    preoteinPerLeanBodyMass = 0.016 * bodyFatPercentage + 1.12;
    return preoteinPerLeanBodyMass * leanBodyMassInPounds;
  }
}

function calculateFatPercentage(bodyFatPercentage) {
  if (sex === "FEMALE") {
    return 0.5 * bodyFatPercentage + 15;
  }
  if (sex === "MALE") {
    return 0.75 * bodyFatPercentage + 16.25;
  }
}
