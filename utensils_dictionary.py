import csv
import json

id = 0
HIRA_IDX = 3
KATA_IDX = 4
KANJI_IDX = 5
OTHER_IDX = 6

result = {}

with open('sheet1.txt', 'rb') as f:
    reader = csv.reader(f)
    for row in reader:
        result[row[HIRA_IDX]] = id
        result[row[KATA_IDX]] = id
        result[row[KANJI_IDX]] = id
        result[row[OTHER_IDX]] = id
        id += 1

with open('out.json', 'w') as outfile:
    dump = json.dumps(result, outfile)
    print dump
