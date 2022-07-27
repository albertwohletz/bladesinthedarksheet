"""Asserts that json is actually working."""
import json
f = open("shadowrun.json", "r")
contents = f.read()
print(contents)
j = json.loads(contents)
print(j)
