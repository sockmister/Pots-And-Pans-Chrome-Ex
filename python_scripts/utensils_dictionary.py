# coding=utf8

import csv
import json
import io

# input must be in utf-8
# output will be in utf-8 json file
def main():
    id = 0
    serial = 0
    JAP_IDX = 1
    ICHIBA_IDX = 2
    HIRA_IDX = 3
    KATA_IDX = 4
    KANJI_IDX = 5
    OTHER_IDX = 6

    result = []

    # for crawler dictionary
    crawler_dict = []

    with open('sheet1-2.csv', 'rb') as f:
        reader = csv.reader(f)
        reader.next()    #skip first line
        for row in reader:
            if row[JAP_IDX] != '':
                result.append(createEntry(row[JAP_IDX], id, serial))
                serial += 1

            if row[ICHIBA_IDX] != '':
                entry = {}
                entry['serial'] = row[ICHIBA_IDX] + str(id) + str(serial)
                entry['Name'] = row[ICHIBA_IDX]
                entry['id'] = id
                result.append(entry)
                serial += 1
            else:
                continue
            if row[HIRA_IDX] != '':
                entry = {}
                entry['serial'] = row[HIRA_IDX] + str(id) + str(serial)
                entry['Name'] = row[HIRA_IDX]
                entry['id'] = id
                result.append(entry)
                serial += 1
            if row[KATA_IDX] != '':
                entry = {}
                entry['serial'] = row[KATA_IDX] + str(id) + str(serial)
                entry['Name'] = row[KATA_IDX]
                entry['id'] = id
                result.append(entry)
                serial += 1
            if row[KANJI_IDX] != '':
                entry = {}
                entry['serial'] = row[KANJI_IDX] + str(id) + str(serial)
                entry['Name'] = row[KANJI_IDX]
                entry['id'] = id
                result.append(entry)
                serial += 1
            if row[OTHER_IDX] != '':
                others_token = parse_other_idx(row[OTHER_IDX])
                for token in others_token:
                    entry = {}
                    entry['serial'] = token + str(id) + str(serial)
                    entry['Name'] = token
                    entry['id'] = id
                    result.append(entry)
                    serial += 1

            #  for crawler dictionary
            entry = []
            if row[ICHIBA_IDX] != '':
                entry.append(row[ICHIBA_IDX])
                entry.append(id)
                crawler_dict.append(entry)
            elif row[JAP_IDX] != '':
                entry.append(row[JAP_IDX])
                entry.append(id)
                crawler_dict.append(entry)

            id += 1

    # with io.open('out.json', 'w', encoding='utf8') as outfile:
    #     json_string = json.dumps(result, ensure_ascii=False).decode('utf8')
    #     json.dump(json_string, outfile, ensure_ascii=False)

    with open('utensils-complete.json', 'w') as outfile:
        json.dump(result, outfile, ensure_ascii=False, indent=4)

    with open('crawler.csv', 'wb') as csvfile:
        writer = csv.writer(csvfile, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)
        for entry in crawler_dict:
            writer.writerow(entry)

# parse other_idx
# assume japanese comma separated
def parse_other_idx(other):
    tokens = other.split("、")
    return tokens

def createEntry(name, id, serial):
    entry = {}
    entry['serial'] = name + str(id) + str(serial)
    entry['Name'] = name
    entry['id'] = id
    return entry

main()
