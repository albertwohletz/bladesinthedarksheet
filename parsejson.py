"""Asserts that json is actually working."""
import json
attributes = ['Insight', 'Hunt', 'Interface', 'Survey', 'Rig', 'Prowess', 'Finesse', 'Prowl', 'Skirmish', 'Wreck', 'Resolve', 'Analyze', 'Command', 'Consort', 'Sway']

f = open("shadowrun.json", "r")
contents = f.read()
j = json.loads(contents)
# print(j)

for playbook in j:
  val = j[playbook]
  for key in ['description', 'two_starting_ability', 'one_starting_ability', 'contacts', 'karma', 'items', 'abilities']:
    if key not in val:
      print(f'{playbook} Missing {key}')

  if len(val["abilities"]) != 8:
    print(f'{playbook} does not have 8 abilities:', len(val["abilities"]))

  if val["two_starting_ability"] not in attributes:
    print(f"{playbook} unrecognized two_starting_ability '%s'" % val["two_starting_ability"])

  if val["one_starting_ability"] not in attributes:
    print(f"{playbook} unrecognized one_starting_ability '%s'" % val["one_starting_ability"])

  if len(val["contacts"]) != 5:
    print(f"{playbook} incorrect number of contacts: ", len(val["contacts"]) )

  if len(val["karma"]) != 3:
    print(f"{playbook} incorrect number of karma(xp) triggers: ", len(val["karma"]) )

  for karma in val["karma"]:
    if karma == "":
      print(f'Empty karma found for {playbook}')

  if len(val["abilities"]) != 8:
    print(f"{playbook} incorrect number of abilities: ", len(val["abilities"]) )

  for ability in val["abilities"]:
    if ':' not in ability:
      print(f"{playbook} Missing : in ability: '{ability}'")
    elif ': ' not in ability:
      print(f"{playbook} Missing space after colon in ability: '{ability}'")

  for item in val["items"]:
    if 'name' not in item:
      print('{playbook} item missing name')
    name = item['name']
    if 'load' not in item:
      print('{playbook} item {name} missing load')
    if 'note' not in item:
      print('{playbook} item {name} missing note')

  if len(val["items"]) == 0:
    print(f'{playbook} needs items')
