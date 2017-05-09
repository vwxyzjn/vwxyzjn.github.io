import os
import json
import time
from bs4 import BeautifulSoup
import codecs

research_path = "components/research_article"

def article_info(path):
    """ Get abstract, title and created date info from articles of path """
    
    # sort article folders based on creation time
    articles_directory = os.listdir(path)
    timesorted_articles_directory = sorted([path + "/" + i for i in articles_directory], key=os.path.getctime)
    timesorted_articles_directory.reverse()
    json_file = []
    
    # get article's title, abstract and created date
    for article in timesorted_articles_directory:
        with open(article + "/article.vue", 'r', encoding="utf8") as f:
            html_article = f.read()
        f.close()
        soup = BeautifulSoup(html_article, 'html.parser')
        abstract = soup.script.string.replace('\n', ' ').split('##', 1)[1][:400]
        title = article[len(path)+1:]
        created_date = time.ctime(os.path.getctime(article))
        json_file += [{'title':title, 'created_date':created_date, 'abstract':abstract}]
    
    # output json file of article's info
    with open("article.json", 'w+') as outfile:
        json.dump(json_file, outfile, indent=4)
            
        
article_info(research_path)