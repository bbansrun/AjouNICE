import requests
import json
import os
from bs4 import BeautifulSoup

CURRENT_DIR = os.path.realpath(os.path.dirname(__file__))
CONSTANTS_DIR = os.path.join(CURRENT_DIR, "./constants/")
url_list = json.load(open(os.path.join(CONSTANTS_DIR, "url_list.json")))


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
            link = urlInfo['link'] + \
                post.find('td', class_='title_comm').a['href']
            posts.append({
                'unit': urlInfo['name'],
                'code': urlInfo['code'],
                'boardName': urlInfo['boardName'],
                'title': title,
                'link': link
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
            posts.append({
                'unit': urlInfo['name'],
                'code': urlInfo['code'],
                'boardName': urlInfo['boardName'],
                'title': title,
                'link': link
            })
        except:
            pass
    return posts


def parse_content_type3(soup, urlInfo):
    posts = []
    lists = soup.select('tr[height]:not([bgcolor])')
    for post in lists:
        try:
            print(post)
            title = post.find('td', attrs={"align": "left"}).a.text.strip()
            link = 'http://software.ajou.ac.kr' + \
                post.find('td', attrs={"align": "left"}).a['href']
            posts.append({
                'unit': urlInfo['name'],
                'code': urlInfo['code'],
                'boardName': urlInfo['boardName'],
                'title': title,
                'link': link
            })
        except:
            pass
    return posts
