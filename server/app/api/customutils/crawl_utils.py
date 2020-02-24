import requests
import json
import os
from urllib.parse import urlparse, parse_qs
from bs4 import BeautifulSoup

CURRENT_DIR = os.path.realpath(os.path.dirname(__file__))
CONSTANTS_DIR = os.path.join(CURRENT_DIR, "./constants/")
url_list = json.load(open(os.path.join(CONSTANTS_DIR, "url_list.json")))

# type 1
def get_article_no(url_string):
    return parse_qs(urlparse(url_string).query)['article_no'][0]

# type 2
def get_article_id(url_string):
    return parse_qs(urlparse(url_string).query)['ai'][0]

# type 3
def get_article_num(url_string):
    return parse_qs(urlparse(url_string).query)['num'][0]

def parse_content(code):
    if (code in list(map(lambda x: x['code'], url_list['type1']))):
        target = list(
            filter(lambda x: x['code'] == code, url_list['type1']))[0]
        return parse_content_type1(BeautifulSoup(requests.get(target['link']).text, 'html.parser'), target)
    if (code in list(map(lambda x: x['code'], url_list['type2']))):
        target = list(
            filter(lambda x: x['code'] == code, url_list['type2']))[0]
        return parse_content_type2(BeautifulSoup(
            requests.get(target['link']).text, 'html.parser'), target)
    if (code in list(map(lambda x: x['code'], url_list['type3']))):
        target = list(
            filter(lambda x: x['code'] == code, url_list['type3']))[0]
        res = requests.get(target['link'])
        res.encoding = 'euc-kr'
        return parse_content_type3(
            BeautifulSoup(res.text, 'html.parser'), target)
    return None

def parse_content_type1(soup, urlInfo):
    posts = []
    for post in soup.select('#jwxe_main_content > div > div.list_wrap > table > tbody > tr'):
        try:
            title = post.find('td', class_='title_comm').a.text.strip()
            link_path = post.find('td', class_='title_comm').a['href']
            link = urlInfo['link'] + link_path
            article_no = get_article_no(link_path)
            posts.append({
                'unit': urlInfo['name'],
                'code': urlInfo['code'],
                'boardName': urlInfo['boardName'],
                'title': title,
                'link': link,
                'article_no': article_no,
            })
        except:
            pass
    return posts

def parse_content_type2(soup, urlInfo):
    posts = []
    for post in soup.select('#contentsArea > table > tbody > tr'):
        try:
            title = post.find('td', class_='aleft').a.text.strip()
            link = '/'.join(urlInfo['link'].split('/')[:-1]) + \
                '/' + post.find('td', class_='aleft').a['href']
            try:
                article_id = get_article_id(link)
            except:
                print(link)
            posts.append({
                'unit': urlInfo['name'],
                'code': urlInfo['code'],
                'boardName': urlInfo['boardName'],
                'title': title,
                'link': link,
                'article_no': article_id
            })
        except:
            pass
    return posts

def parse_content_type3(soup, urlInfo):
    posts = []
    lists = soup.select('tr[height]:not([bgcolor])')
    for post in lists:
        try:
            title = post.find('td', attrs={"align": "left"}).a.text.strip()
            link = 'http://software.ajou.ac.kr' + \
                post.find('td', attrs={"align": "left"}).a['href']
            article_num = get_article_num(link)    
            posts.append({
                'unit': urlInfo['name'],
                'code': urlInfo['code'],
                'boardName': urlInfo['boardName'],
                'title': title,
                'link': link,
                'article_no': article_num
            })
        except:
            pass
    posts.sort(key=lambda x: x['article_no'], reverse=True)
    return posts

def get_schedule():
    target_url = url_list['schedule']['link']
    soup = BeautifulSoup(requests.get(target_url).text, 'html.parser')
    rows = soup.select('#jwxe_main_content > div > div.jwxe_html.jw-relative > table > tbody > tr')
    results = []
    for row in rows:
        try:
            tds = row.find_all('td')
            date, event, etc = map(lambda x: x.text.strip(), tds)
            results.append({
                'date': date,
                'event': event,
                'etc': etc,
            })
        except:
            pass
    return results
            
