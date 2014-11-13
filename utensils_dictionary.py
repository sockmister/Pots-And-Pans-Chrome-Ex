# coding=utf8

import csv
import json
import io

# input must be in utf-8
# output will be in utf-8 json file
def main():
    id = 0
    HIRA_IDX = 3
    KATA_IDX = 4
    KANJI_IDX = 5
    OTHER_IDX = 6

    result = {}

    with open('sheet1.txt', 'rb') as f:
        reader = csv.reader(f)
        for row in reader:
            if row[HIRA_IDX] != '':
                result[row[HIRA_IDX]] = id
            if row[KATA_IDX] != '':
                result[row[KATA_IDX]] = id
            if row[KANJI_IDX] != '':
                result[row[KANJI_IDX]] = id
            if row[OTHER_IDX] != '':
                others_token = parse_other_idx(row[OTHER_IDX])
                for token in others_token:
                    result[token] = id
            id += 1

    # with io.open('out.json', 'w', encoding='utf8') as outfile:
    #     json_string = json.dumps(result, ensure_ascii=False).decode('utf8')
    #     json.dump(json_string, outfile, ensure_ascii=False)

    with open('utensils-complete.json', 'w') as outfile:
        json.dump(result, outfile, ensure_ascii=False, indent=4)

# parse other_idx
# assume japanese comma separated
def parse_other_idx(other):
    tokens = other.split("、")
    return tokens

main()
