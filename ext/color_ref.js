function addColorBlockHead(name, block) {
  let div = document.createElement('div');
  div.className = "head";
  div.innerText = name;
  div.style.color = name;
  block.append(div);
}
function addColorBlock(name, color, block) {
  let div = document.createElement('div');
  div.className = "color";
  div.innerHTML = `${name}<br/>${String(color).toUpperCase()}`;
  div.setAttribute('style', `background-color: ${color} !important;`)
  // div.style.background = color;
  block.append(div);
}
function buildColorTable(dbFile, el) {
fetch(dbFile)
  .then(res=>res.json())
  .then(data=>{
    for (let i in data){ 
      let block = document.createElement('div');
      block.className = 'col';
      addColorBlockHead(i, block);
      for (let c of data[i]) {
        addColorBlock(c.name, c.color, block);
      }
      el.append(block);
    }
  });
}
buildColorTable('colordb_material.json', mdTb);
buildColorTable('colordb_named.json', cnTb);
