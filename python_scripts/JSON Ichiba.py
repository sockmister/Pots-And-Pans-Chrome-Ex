
# coding: utf-8

# Name: JSON Ichiba
# Date: Nov 2014
# Author: Pots & Pans
#
#
#
# Dependency (not yet completed): Read Dictionary - this script reads a csv file containing kitchen tools dictionary.
#
# Functions:
# print_json(kitchen_dictlist)
#  -prints json to a text file
#  -calls search_all
#  -returns none
#
# search_oneitem(searchterm, genre)
#  -returns structure with info for one item
#  -doesn't use genre for now
#
# search_allitems(kitchen_dictlist)
#  -calls search_oneitem() on all items
#  -returns structure with info for all items
#
#
#

# In[63]:

import json
import requests
import io
import csv
import time


# In[64]:

def search_oneitem(searchterm, searchterm_id):
    app_id = 1076897669144252157
    url = 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20140222'

    #these are "get parameters"
    genreId = 558944
    options = {'format': 'json', 'keyword': searchterm, 'applicationId': app_id, 'formatversion': 2,
       'elements': 'itemName,itemPrice,itemUrl,imageFlag,smallImageUrls,mediumImageUrls,availability',
       'genreId': genreId}
    print("searching " + searchterm)
    data = requests.get(url, params=options)
    data = data.text
    # load a json string into a collection of lists and dicts
    data = json.loads(data)

    print(len(data['Items']))
    min_index = min(len(data['Items']), 30)
    links = [dict(item_name=data['Items'][i]['Item']['itemName'].encode('utf8'),
                  price=data['Items'][i]['Item']['itemPrice'],
                  url=data['Items'][i]['Item']['itemUrl'],
                  has_image=data['Items'][i]['Item']['imageFlag'],
                  small_image_urls=data['Items'][i]['Item']['smallImageUrls'],
                  med_image_urls=data['Items'][i]['Item']['mediumImageUrls'],
                  availability=data['Items'][i]['Item']['availability']) for i in range(0,min_index)]


    search_link = "http://search.rakuten.co.jp/search/mall/%s/" %(searchterm)

    oneitem_json = dict(Serial = searchterm+searchterm_id, Name= searchterm, ID= searchterm_id, Details= dict(search_link= search_link, links= links))
    return oneitem_json


# In[65]:

#Old code but might revert back
'''
#Create our own json structure
links = [dict(item_name=i['Item']['itemName'],
      price=i['Item']['itemPrice'],
      url=i['Item']['itemUrl'],
      has_image=i['Item']['imageFlag'],
      small_image_urls=i['Item']['smallImageUrls'],
      med_image_urls=i['Item']['mediumImageUrls'],
      availability=i['Item']['availability']) for i in data['Items']]
'''


# In[66]:

def search_allitems(kitch_list):
    data = []
    for t in kitch_list:
        data.append(search_oneitem(t[0], t[1]))
        time.sleep(1.02)
    return data


# In[67]:

def print_json(kitch_list):
    data = search_allitems(kitch_list)

    #Print to a text file
    with io.open('links.json', 'wb') as outfile:
        json.dump(data, outfile, indent=4, ensure_ascii=False)
    return


# In[68]:

kitch_list = ["天板", "粉ふるい器", "ボウル", "ハンドミキサー", "ナイフ"]



# In[69]:

def readin_searchlist():
    kitch_list = []

    with open('crawler.csv', 'rb') as f:
        reader = csv.reader(f)
        for row in reader:
            kitch_list.append((row[0], row[1]))
    return kitch_list


# In[70]:

kitch_list = readin_searchlist()
print_json(kitch_list)


# In[70]:
