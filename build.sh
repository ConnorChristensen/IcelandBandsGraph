node db.js > data.json && \
printf %s "const json = " > index.js && \
cat data.json >> index.js && \
echo "\n" >> index.js && \
cat index_template.js >> index.js
