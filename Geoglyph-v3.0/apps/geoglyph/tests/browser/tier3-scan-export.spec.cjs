const {test,expect}=require('./studio-fixture.cjs');

test('scan table retains unchanged rows and directory export preserves ordered QR content and authored edits',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/');
  await page.waitForFunction(()=>window.GeoGlyphStudio);
  await page.locator('[data-workflow="qr"]').first().click();
  await page.locator('[data-workflow="qreverse"]').first().click();
  const rows=await page.evaluate(()=>{
    const api=GeoGlyphStudio,s=api.state;
    // Use a conventional four-module quiet zone for the decoder fixture.
    s.quietZone=4;s.qrMode='square';
    document.getElementById('qrInput').value='AUTHORED-ORIGINAL';
    s.qreverse.rows=Array.from({length:6},(_,i)=>({id:100+i,groupId:'',source:'CSV',value:'tier3-export-'+i,selected:true,status:'Processed',error:'',filename:'fixture.csv',path:'fixture.csv'}));
    s.qreverse.lastDesignPreview='qr';
    api.renderQReverse();
    const nodes=[...document.querySelector('#qreverseBody').children];
    s.qreverse.rows[2].value='tier3-export-changed';api.renderQReverse();
    const stable=nodes.every((node,i)=>node===document.querySelector('#qreverseBody').children[i]);
    const firstCheckbox=nodes[0].querySelector('input');api.renderQReverse();
    const stableCheckbox=firstCheckbox===nodes[0].querySelector('input');
    window.tier3Files=[];
    window.showDirectoryPicker=async()=>({getFileHandle:async name=>({createWritable:async()=>({
      write:async blob=>{window.tier3Files.push({name,blob});if(window.tier3Files.length===1)document.getElementById('qrInput').value='AUTHORED-DURING-EXPORT';},
      close:async()=>{},abort:async()=>{}
    })})});
    return {stable,stableCheckbox,values:s.qreverse.rows.map(row=>row.value)};
  });
  expect(rows.stable).toBe(true);expect(rows.stableCheckbox).toBe(true);
  // The current UI delegates to this hidden legacy action.
  await page.locator('#qreverseBatchFolderBtn').evaluate(button=>button.click());
  await expect.poll(()=>page.evaluate(()=>GeoGlyphStudio.state.qreverse.exporting)).toBe(false);
  const result=await page.evaluate(async()=>{
    const decoded=[];
    const authored=document.getElementById('qrInput').value;
    let pixelDifferences=0,index=0;
    for(const {name,blob} of window.tier3Files){
      const bitmap=await createImageBitmap(blob),canvas=document.createElement('canvas');canvas.width=bitmap.width;canvas.height=bitmap.height;
      const ctx=canvas.getContext('2d');ctx.drawImage(bitmap,0,0);
      document.getElementById('qrInput').value=GeoGlyphStudio.state.qreverse.rows[index++].value;
      const reference=document.createElement('canvas');await GeoGlyphStudio.drawQrToCanvas(reference,1024,false);
      const actual=ctx.getImageData(0,0,1024,1024).data,expected=reference.getContext('2d').getImageData(0,0,1024,1024).data;
      for(let i=0;i<actual.length;i++)if(actual[i]!==expected[i])pixelDifferences++;
      // jsQR gives identical false negatives for old and new draw paths at
      // 1024px for this fixture; decode a 512px test copy, retaining 1024px output.
      const scan=document.createElement('canvas');scan.width=scan.height=512;
      scan.getContext('2d').drawImage(bitmap,0,0,512,512);bitmap.close();
      const image=scan.getContext('2d').getImageData(0,0,512,512);
      decoded.push({name,width:canvas.width,height:canvas.height,value:jsQR(image.data,512,512,{inversionAttempts:'attemptBoth'})?.data});
    }
    document.getElementById('qrInput').value=authored;
    return {decoded,authored,pixelDifferences};
  });
  expect(result.pixelDifferences).toBe(0);
  expect(result.decoded.every(file=>file.width===1024&&file.height===1024)).toBe(true);
  expect(result.decoded.map(file=>file.value)).toEqual(rows.values);
  expect(result.decoded.map(file=>file.name)).toEqual(Array.from({length:6},(_,i)=>'geoglyph-batch-'+String(i+1).padStart(3,'0')+'.png'));
  expect(result.authored).toBe('AUTHORED-DURING-EXPORT');expect(errors).toEqual([]);
});
