# ИИ: эталоны только для QA, не используются как экранные ассеты. Запись №19.
from PIL import Image,ImageDraw
import pathlib,json,numpy as np
ids=sorted(pathlib.Path('qa/reference').glob('*.png'))
sheet=Image.new('RGB',(1920,296*((len(ids)+1)//2)),'white')
draw=ImageDraw.Draw(sheet); report=[]
for i,p in enumerate(ids):
    a=Image.open(p).convert('RGB'); b=Image.open('qa/rendered/'+p.stem+'.jpg').convert('RGB')
    x=(i%2)*960;y=(i//2)*296
    draw.text((x+8,y+4),p.stem+' Figma | Browser',fill='black')
    sheet.paste(a.resize((480,270)),(x,y+26));sheet.paste(b.resize((480,270)),(x+480,y+26))
    d=np.abs(np.array(a.resize((1024,576))).astype(float)-np.array(b.resize((1024,576))).astype(float)).max(axis=2)
    report.append(dict(id=p.stem,changed_percent=round(float((d>40).mean()*100),2),average=round(float(d.mean()),2)))
sheet.save('qa/desktop-comparison.png')
pathlib.Path('qa/desktop-difference.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report))
