"C:\Program Files\7-Zip\7z.exe" a release.zip *.js node_modules council-providers
 aws s3 cp .\release.zip s3://wilts-bin-day-alexa-skill/release.zip
 aws lambda update-function-code --function-name wiltshireBinDaySkill --s3-bucket wilts-bin-day-alexa-skill --s3-key release.zip