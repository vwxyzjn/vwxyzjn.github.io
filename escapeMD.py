import os
import pickle

with open ('Programming Assignment 2.md', 'rb') as f:
    md_byte = f.read()

md =  md_byte.decode("utf-8").replace("`", "\`")

with open('test.md', 'wb') as f:
    f.write(bytes(md,'utf8'))