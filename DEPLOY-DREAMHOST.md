# Deploying to Dreamhost (f128.info/montgomery-ancestry)

## Option 1: FTP/SFTP Upload
1. Connect to your Dreamhost server via SFTP
2. Navigate to the web root for f128.info
3. Create a `montgomery-ancestry/` directory
4. Upload these files:
   - index.html
   - css/ (entire directory)
   - js/ (entire directory)  
   - data/ (entire directory)
   - README.md
5. The site will be live at http://f128.info/montgomery-ancestry/

## Option 2: Git Clone
1. SSH into your Dreamhost server
2. cd to the web root for f128.info
3. git clone https://github.com/NiyaNagi/montgomery-ancestry.git
4. The site will be live at http://f128.info/montgomery-ancestry/

## Option 3: rsync
```bash
rsync -avz --exclude=node_modules --exclude=.git --exclude=tests \
  . user@f128.info:~/f128.info/montgomery-ancestry/
```
