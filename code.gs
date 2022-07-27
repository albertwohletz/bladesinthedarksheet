const NAME_COLUMN = 2;
const NAME_ROW = 2;

const CLASS_COLUMN = 18;
const CLASS_ROW = 2;

const ATTRIBUTE_COLUMN = 49;
const ATTRIBUTE_ROW_START = 9;
const ATTRIBUTE_ORDER = ['Insight', 'Hunt', 'Interface', 'Survey', 'Rig', 'Prowess', 'Finesse', 'Prowl', 'Skirmish', 'Wreck', 'Resolve', 'Analyze', 'Command', 'Consort', 'Sway'];

const CHARACTER_SHEET_START_INDEX = 3;

const PLAYBOOKS = {
  'Street Samurai': {
    'description': 'A noble and honorable fighter',
    'two_starting_ability': 'Skirmish',
    'one_starting_ability': 'Command',
    'contacts': [
      "Doc, A street doctor",
      "Comrade Pirate, A fixer",
      "Bomb Voyage, A terrorist",
      "Smasher, a cold killer",
      "Doge, A bounty Hunter"
    ],
    'karma': [
      "You addressed a challenge with violence or coercion.",
      "You upheld your personal code of honor at a cost.",
      "You dueled someone worthy."
    ],
    'items': [
      { "name": "Fine Melee Weapon", "load": 1, "note": "An Ares monofilament sword, Katana, or a stun baton.", },
      { "name": "Fine long rifle", "load": 2, "note": "A sniper rifle or assault rifle.", },
      { "name": "Light Armor", "load": 1, "note": "Lighter than normal armor" },
      { "name": "Restraints", "load": 1, "note": "Plasteel security restraints" },
      { "name": "Kamakaze Vial", "load": 0, "note": "Kamikaze is a tailored amphetamine combat drug. In moderate doses, kamikaze can give users an edge, somewhat equalizing the odds when unaugmented (either biologically or cybernetically) individuals face augmented opponents in combat. As use continues and addiction grows, the individual requires larger doses, and adverse side effects begin to manifest. Large doses can cause excitement, tremors, momentary euphoria and dilated pupils. Excess doses (bordering on overdose level) cause anxiety, hallucinations and uncontrolled muscular movements. Even higher dosages lead to death." },
      { "name": "Your personal Code", "load": 0, "note": "Your personal street code." },
    ],
    'abilities': [
      "Cyborg: You start with one piece of cyberware.  +1d when rolling for surgical complications when installing new cyberware.",
      "Not to be trifled with: You can push yourself to do one of the following: perform a feat of physical force that verges on the superhuman—engage a small gang on equal footing in close combat",
      "Bodyguard: When you protect someone, resist with +1d. When you take harm, clear 1 stress.",
      "Imposing: When you gather info to anticipate possible threats in the current situation, you get +1 effect. When you dissuade someone from escalating to physical violence by commanding them, you have potency.",
      "Predator: Take +1d to rolls against weakened or vulnerable targets. Whenever you gather information on a weakness or vulnerability, the worst you can get is a 4/5 result.",
      "Follow Through: When you take harm from someone, you learn about them and they become more susceptible to you. Immediately ask 1 question from gather information and take +1d against them.",
      "Quick Healer:  If you’re wounded at the beginning of downtime, mark +3 segments on your healing clock. When you push yourself to ignore wound penalties, you take only 1 stress (not 2).",
      "Tough as Nails: Penalties from harm are one level less severe (though level 4 harm is still fatal).",
    ],
  },
  'Rigger': {
    'abilities': [
      "Drone Creator: When you invent or build a drone, take +1 result level to your roll. You begin with one special drone already.",
      "In Control: When you control a drone you are not distracted when in AR (no dice penalty).  You can push yourself to take an action with your physical body while being in VR.",
      "Ace: You can Finesse a vehicle to takeoff, control, or land it—regardless of its means of propulsion. You gain potency when you make difficult maneuvers while piloting a vehicle.",
      "Precise: You may expend your special armor to resist a consequence from mechanical failure, or to push yourself when inventing, crafting, or destroying something mechanical.",
      "Jury Rig: When you Engineer to repair or alter a device, the work is much faster than it should be and you don’t need all the parts or tools.",
      "Junkyard Hunter: When you acquire parts or equipment during downtime, you may either gain two assets, or one asset at +1 quality.",
      "I can fix you: It does not cost cred to repair or rebuild a damaged drone.  You can expend special armor to resist a consequence that causes damage to a drone.",
      "Eidetic Memory: When you’ve witnessed something destroyed or disassembled, take +1d to making a schematic for it and crafting it.  You gain potency on actions to it or copies as well.",
    ],
  }
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('AlScript')
    .addItem('Roll Attributes', 'showSidebar')
    .addItem('Roll Engagement', 'showEngagement')
    .addItem('Create Clock', 'createClock')
    .addItem('Create Character', 'showNewCharacterDialog')
    .addToUi();
}

function cleanRollLog() {
  getNamedRange('RollLog').clearContent();
  getNamedRange('RollLog').clearFormat();
}

// Create Clock shortcuts so we can attach these to buttons.
function createClock10() {
  createClock(10);
}

function createClock8() {
  createClock(8);
}

function createClock6() {
  createClock(6);
}

function createClock4() {
  createClock(4);
}

function createClock(count) {
  // Move all clocks down one row.
  var histRange2 = getNamedRange('ClockList');
  var histRange = getNamedRange('AllClocks')
  histRange.copyTo(histRange2);

  // Create clock at top.
  var copyClock = getNamedRange('CopyClock');
  var newClock = getNamedRange('NewClock')
  copyClock.copyTo(newClock);

  // We copy a 10 clock, so shorten Clock if length is less than 10.
  if (count < 10) {
    var rightcol = 10 - count;
    var leftcol = newClock.getColumn() + count + 2;
    SpreadsheetApp.getActiveSheet().getRange(2, leftcol, 1, rightcol).clear();
    SpreadsheetApp.getActiveSheet().getRange(2, leftcol, 1, rightcol).removeCheckboxes();
  }
}
function foo() {
  //createNewCharacter('Riggy', 'Rigger');
  createNewCharacter('Sammy', 'Street Samurai');
}
function createNewCharacter(name, playbookName) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var template = getSheetById(1021858392);
  var characterSheet = template.copyTo(spreadsheet);
  characterSheet.setName(name);
  characterSheet.getRange(NAME_ROW, NAME_COLUMN).setValue(name);
  var playbook = PLAYBOOKS[playbookName];

  // Set Name
  getNamedRangeForSheet('PlaybookName', characterSheet).setValue(playbookName);

  // Set Description
  getNamedRangeForSheet('PlaybookDescription', characterSheet).setValue(playbook['description']);

  // Set Abilities
  var abilitiesRange = getNamedRangeForSheet('PlaybookAbilities', characterSheet);
  var abilityValues = []; // needs to be a 1x16 array of values, with every other value being [' '];
  var bold = SpreadsheetApp.newTextStyle().setBold(true).build();
  for (var ability of playbook['abilities']) {
    // Bold all text up to the colon.
    var colonIndex = ability.indexOf(':');
    abilityValues.push([SpreadsheetApp.newRichTextValue().setText(ability).setTextStyle(0, colonIndex, bold).build()]);
    abilityValues.push([SpreadsheetApp.newRichTextValue().setText('').build()]);
  }
  abilitiesRange.setRichTextValues(
    abilityValues
  );

  // Set Contacts
  var contactsRange = getNamedRangeForSheet('PlaybookContacts', characterSheet);
  var contactValues = [];
  for (contact of playbook['contacts']) {
    contactValues.push([contact]);
  }
  contactsRange.setValues(contactValues);

  // Set Karma
  var karmaRange = getNamedRangeForSheet('PlaybookKarma', characterSheet);
  var karmaValues = []
  for (karma of playbook['karma']) {
    karmaValues.push([karma]);
    karmaValues.push(['']);
  }
  karmaRange.setValues(karmaValues);

  // Items
      // { "name": "Fine Melee Weapon", "load": 1, "note": "An Ares monofilament sword, Katana, or a stun baton.", },
      // { "name": "Fine long rifle", "load": 2, "note": "A sniper rifle or assault rifle.", },
  var itemRange = getNamedRangeForSheet('PlaybookItems', characterSheet);
  var row = itemRange.getRowIndex();
  var column = itemRange.getColumnIndex();
  var italics = SpreadsheetApp.newTextStyle().setItalic(true).build();
  var noLoadCheckbox = SpreadsheetApp.newDataValidation().requireCheckbox('NOLOAD').build();
  for (var item of playbook['items']) {
    characterSheet.getRange(row, column+1).setValue(item.name);
    characterSheet.getRange(row, column+1).setNote(item.note);
    if (item.load == 0) {
      // Set the checkbox to have a different value so these items aren't counted against load.
      characterSheet.getRange(row, column+1).setTextStyle(italics);
      characterSheet.getRange(row, column-1).setDataValidation(noLoadCheckbox);
    }
    if (item.load < 2) {
      characterSheet.getRange(row, column).removeCheckboxes();
      characterSheet.getRange(row, column).setValue('');
    }
    row++;
  }

  // Attributes
  var a = ATTRIBUTE_ROW_START + ATTRIBUTE_ORDER.indexOf(playbook['one_starting_ability']);
  var b = ATTRIBUTE_ORDER.indexOf(playbook['one_starting_ability']);
  characterSheet.getRange(ATTRIBUTE_ROW_START + ATTRIBUTE_ORDER.indexOf(playbook['one_starting_ability']), ATTRIBUTE_COLUMN - 7).setValue('TRUE');
  characterSheet.getRange(ATTRIBUTE_ROW_START + ATTRIBUTE_ORDER.indexOf(playbook['two_starting_ability']), ATTRIBUTE_COLUMN - 7).setValue('TRUE');
  characterSheet.getRange(ATTRIBUTE_ROW_START + ATTRIBUTE_ORDER.indexOf(playbook['two_starting_ability']), ATTRIBUTE_COLUMN - 6).setValue('TRUE');

  characterSheet.activate();
  spreadsheet.moveActiveSheet(CHARACTER_SHEET_START_INDEX);
  SpreadsheetApp.getUi().alert('New Sheet has been successfully created!');
  generatePCTracker();
}

function showNewCharacterDialog() {
  var html = HtmlService.createHtmlOutputFromFile('newcharacter')
      .setWidth(400)
      .setHeight(300);
  html = html.append('<script>');
  html = html.append('initialize(' + JSON.stringify(Object.keys(PLAYBOOKS)) + ');');
  html = html.append('</script>');
  SpreadsheetApp.getUi().showModalDialog(html, 'New Character');
}

function showSidebar(selectedAttribute) {
  var sheetId = SpreadsheetApp.getActiveSheet().getSheetId();
  var data = {
    sheetId: sheetId,
    selectedAttribute: selectedAttribute,
    characters: getCharacterSheets(),
  };
  var html = HtmlService.createHtmlOutputFromFile('sidebar')
    .setTitle('🎲')
    .setWidth(300);
  html = html.append('<script>');
  html = html.append('initialize(' + JSON.stringify(data) + ');');
  html = html.append('</script>');
  SpreadsheetApp.getUi().showSidebar(html);
}

function showEngagement() {
  var html = HtmlService.createHtmlOutputFromFile('sidebar')
    .setTitle('🎲')
    .setWidth(300);
  html = html.append('<script>');
  html = html.append("document.querySelector('#attribute-roller').style.display='none';");
  html = html.append("document.querySelector('#engagement-roller').style.display='block';");
  html = html.append('</script>');
  SpreadsheetApp.getUi().showSidebar(html);
}

function generatePCTracker() {
  var chars = getCharacterSheets();
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  var range = getNamedRange('PCTracker');
  values = [];
  for (char of chars) {
    values.push([char.name, "=CONCATENATE(COUNTIF('" + char.name + "'!A19:J19, TRUE), \"/9\")",
    '=textjoin(", ", 1, \'' + char.name + '\'!C26:H26)', '',
    '=textjoin(", ", 1, \'' + char.name + '\'!C24:H24)', '',
    '=\'' + char.name + '\'!C22',
      '', '', '', '', '', '', '', '',
    '=CONCATENATE(\'' + char.name + '\'!BD28, "  (", \'' + char.name + '\'!AW28, ")")']);
    if (values.length == 5) {
      break;
    }
  }
  while (values.length < 5) {
    values.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  }
  range.setValues(values);
}

function debugRollAttribute() {
  rollAttribute('Interface', 30, 1021858392);
}

function rollAttribute(attribute, bonusDice, sheetId) {
  start = new Date().getTime();
  clearRollLog();
  var sheet = getSheetById(sheetId);
  var totalDice = (sheet == null || !attribute ? 0 : getPcAttribute(attribute, sheet)) + bonusDice;
  var roll = rollDice(totalDice)

  if (attribute !== '0') {
    roll.attribute = attribute;
  }
  if (sheet != null) {
    roll.sheetId = sheet.getSheetId();
    roll.character = getPcName(sheet);
  } else {
    roll.character = '';
  }
  logRoll(attribute, roll);
  return roll;
}

function rollAndLog(dice, name) {
  clearRollLog();
  var roll = rollDice(dice)
  roll.attribute = name;
  logRoll(name, roll);
  return roll;
}

function getPcAttribute(attribute, sheet) {

  var range = sheet.getRange(ATTRIBUTE_ROW_START + ATTRIBUTE_ORDER.indexOf(attribute), ATTRIBUTE_COLUMN);
  return parseInt(range.getValue(), 10);
}

function getPcName(sheet) {
  var range = sheet.getRange(NAME_ROW, NAME_COLUMN);
  var name = range.getValue();
  if (name == null || name.length === 0) {
    return sheet.getName();
  } else {
    return range.getValue();
  }
}

function rollDice(numberOfDice) {
  var dice = [];
  var keepLowest = !numberOfDice;
  var actualDice = keepLowest ? 2 : numberOfDice;
  var resultInt = undefined;
  for (var i = 0; i < actualDice; i++) {
    var roll = parseInt(Math.floor(Math.random() * 6) + 1, 10);
    resultInt = calculateResultInteger(resultInt, roll, keepLowest);
    dice.push(roll);
  }
  var result = getResultString(resultInt);
  // dice = dice.sort();
  if (!keepLowest) {
    dice = dice.reverse();
  }
  return {
    numberOfDice: numberOfDice,
    dice: dice,
    keepLowest: keepLowest,
    result: result,
    resultInt: resultInt,
  };
}

function getCharacterSheets() {
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  var characters = [];
  for (var sheet of sheets) {
    if (!sheet.isSheetHidden() && isCharacterSheet(sheet)) {
      characters.push({ name: getPcName(sheet), sheetId: sheet.getSheetId() });
    }
  }
  return characters;
}

function calculateResultInteger(oldResult, roll, keepLowest) {
  if (oldResult == null) {
    return roll;
  } else if (keepLowest) {
    return Math.min(oldResult, roll);
  } else if (oldResult === 6 && roll === 6) {
    return 7;
  } else {
    return Math.max(oldResult, roll);
  }
}

function isCharacterSheet(sheet) {
  var t = sheet.getRange(2, 2).getValue();
  return sheet.getRange(3, 2).getValue() == 'Name';
}

function getResultString(result) {
  if (result > 6) {
    return 'Crit!!! 💥';
  } else if (result === 6) {
    return 'Success! 😊';
  } else if (result >= 4) {
    return 'Partial Success 😐';
  } else {
    return 'Failure 😭';
  }
}

function getResultColor(result) {
  if (result >= 6) {
    return 'green';
  } else if (result >= 4) {
    return 'orange';
  } else {
    return 'red';
  }
}

function logRoll(attribute, roll) {
  var coloredStyle = SpreadsheetApp.newTextStyle().setForegroundColor(getResultColor(roll.resultInt)).build();
  var regularStyle = SpreadsheetApp.newTextStyle().setForegroundColor('black').build();

  var characterRtf = '';
  if (roll.character) {
    characterRtf = SpreadsheetApp.newRichTextValue().setText(roll.character).setLinkUrl('#gid=' + roll.sheetId).build();
  } else {
    characterRtf = SpreadsheetApp.newRichTextValue().setText(attribute).build();
  }
  var attributeRtf = SpreadsheetApp.newRichTextValue().setText(attribute).build();
  var numDiceRtf = SpreadsheetApp.newRichTextValue().setText(roll.numberOfDice + 'd6').build();
  var resultRtf = SpreadsheetApp.newRichTextValue().setText(roll.result).setTextStyle(coloredStyle).build();

  var rollValuesRtfBuilder = SpreadsheetApp.newRichTextValue()
    .setText('\'' + roll.dice.join(', '))
    .setTextStyle(regularStyle);

  // Highlight all dice that match the result.
  var highestDice = Math.min(roll.resultInt, 6);
  for (var i = 0; i < roll.dice.length; i++) {
    if (roll.dice[i] == highestDice) {
      rollValuesRtfBuilder.setTextStyle(i * 3, i * 3 + 1, coloredStyle);
    }
  }
  var rollValuesRtf = rollValuesRtfBuilder.build();
  getNamedRange('LastRollAllCells').setRichTextValues([[characterRtf], [attributeRtf], [numDiceRtf], [rollValuesRtf], [resultRtf]]);
}

function clearRollLog() {
  var regularStyle = SpreadsheetApp.newTextStyle().setUnderline(false).setForegroundColor('black').build();

  // Copy History Down
  var histRange = getNamedRange("RollLog");
  var histRange2 = getNamedRange("RollLogLower");
  histRange.copyTo(histRange2);

  // Copy current to top
  var sourceRange = getNamedRange("LastRoll");
  var destRange = getNamedRange("RollLogTop");
  sourceRange.copyTo(destRange);

  // Delete the top roll.
  getNamedRange('LastRollAllCells').setTextStyle(regularStyle).setValue('🎲');
}

function getSheetById(sheetId) {
  sheetId = parseInt(sheetId, 10);
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  for (var sheet of sheets) {
    if (sheet.getSheetId() === sheetId) {
      return sheet;
    }
  }
  return null;
}

function getNamedRangeForSheet(name, sheet) {
  var namedRanges = sheet.getNamedRanges();
  for (var range of namedRanges) {
    var rangeName = range.getName();
    if (range.getName().endsWith(name)) {
      return range.getRange();
    }
  }
  return null;
}

function getNamedRange(name) {
  var namedRanges = SpreadsheetApp.getActiveSpreadsheet().getNamedRanges();
  for (var range of namedRanges) {
    var rangeName = range.getName();
    if (range.getName().endsWith(name)) {
      return range.getRange();
    }
  }
  return null;
}

function openSheet(sheetId) {
  var sheet = getSheetById(sheetId);
  if (sheetId != null) {
    SpreadsheetApp.setActiveSheet(sheet);
  }
}

