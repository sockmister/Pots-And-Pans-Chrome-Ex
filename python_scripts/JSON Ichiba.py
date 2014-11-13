
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

# In[7]:

import json
import requests


# In[2]:

import time


# In[5]:




def search_oneitem(searchterm): 
    app_id = 1076897669144252157
    url = 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20140222'

    #these are "get parameters"
    options = {'format': 'json', 'keyword': searchterm, 'applicationId': app_id, 'formatversion': 2, 
       'elements': 'itemName,itemPrice,itemUrl,imageFlag,smallImageUrls,mediumImageUrls,availability'} 
    data = requests.get(url, params=options)
    data = data.text
    
    
    # load a json string into a collection of lists and dicts
    data = json.loads(data)  
    #print data
    
    #print 'PRINTING AVAILABILITY:  ' + str(data['Items'][0]['Item']['availability'])


    links = [dict(item_name=data['Items'][i]['Item']['itemName'], 
                  price=data['Items'][i]['Item']['itemPrice'], 
                  url=data['Items'][i]['Item']['itemUrl'],
                  has_image=data['Items'][i]['Item']['imageFlag'],
                  small_image_urls=data['Items'][i]['Item']['smallImageUrls'],
                  med_image_urls=data['Items'][i]['Item']['mediumImageUrls'],
                  availability=data['Items'][i]['Item']['availability']) for i in range(0,2)]

    search_link = "http://search.rakuten.co.jp/search/mall/%s/" %(searchterm)

    oneitem_json = dict(Name= searchterm, Details= dict(search_link= search_link, links= links))
    return oneitem_json
    
    #print json.dumps(data, indent=2)
    #print json.dumps(oneitem_json, indent=2)


# In[ ]:



#Old code but might revert back
'''
     Create our own json structure
    links = [dict(item_name=i['Item']['itemName'], 
          price=i['Item']['itemPrice'], 
          url=i['Item']['itemUrl'],
          has_image=i['Item']['imageFlag'],
          small_image_urls=i['Item']['smallImageUrls'],
          med_image_urls=i['Item']['mediumImageUrls'],
          availability=i['Item']['availability']) for i in data['Items']]
'''


# In[12]:




# In[3]:

#kitch_list = ["天板", "粉ふるい器", "ボウル", "ハンドミキサー", "ナイフ"]
kitch_list = ["粉ふるい器", "ボウル", "ナイフ", "ハンドミキサー"]


# In[11]:


#data = [search_oneitem(t) for t in kitch_list]

'''Testing code
for t in kitch_list:
    print t
    print search_oneitem(t)
    time.sleep(1.1)
'''

def search_allitems(kitch_list): 
    data = []
    for t in kitch_list:
        data.append(search_oneitem(t))
        time.sleep(1.02)
    return data



# In[9]:




# In[13]:

data = search_allitems(kitch_list) 
print json.dumps(data, indent=2)


# In[ ]:


#Print to a text file
with open('data.txt', 'w') as outfile:
  json.dump(data, outfile, indent=2)

