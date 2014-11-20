import csv
import json

HANDLE_IDX = 8
VERBS_IDX = 10

def main():
    final_result = []

    with open('bad.csv', 'rb') as f:
        reader = csv.reader(f)
        reader.next()

        for row in reader:
            to_handle = row[HANDLE_IDX]
            if to_handle == "Verb to Utensil":
                verbs = row[VERBS_IDX]
                parsed_verbs = parse_verbs(verbs)
                final_result = final_result + parsed_verbs

    final_result = merge_results(final_result)

    # output to json
    with open('verbs.json', 'w') as outfile:
        json.dump(final_result, outfile, ensure_ascii=False, indent=4)


# returns
def parse_verbs(verbs):
    # open utensils.json
    with open('utensils-complete.json', 'rb') as f:
        utensils_json = json.load(f)

    verbs = verbs.split("/")

    result = []
    for verb in verbs:
        tokens = verb.split(":")
        verb = tokens[0]
        utensils = tokens[1].split(",")
        # TODO switch to ID here
        utensils_id = []
        for utensil in utensils:
            utensils_id.append(searchForID(utensil, utensils_json))

        obj = {"verb": verb, "ids": utensils_id}
        result.append(obj)

    return result


def searchForID(utensil, json):
    utensil = utensil.decode("utf8")

    for item in json:
        if item["Name"] == utensil:
            return item["id"]

    print(utensil + " not found.")
    return -1

def merge_results(final_result):
    verb_dict = {}
    for verb_item in final_result:
        if verb_item['verb'] in verb_dict:
            verb_dict[verb_item['verb']] = verb_dict[verb_item['verb']] + verb_item['ids']
        else:
            verb_dict[verb_item['verb']] = verb_item['ids']

    for verb_item in verb_dict:
        verb_dict[verb_item] = list(set(verb_dict[verb_item]))

    final_result = []
    for verb_item in verb_dict:
        final_result.append({"verb": verb_item, "ids": verb_dict[verb_item]})

    return final_result

main()
