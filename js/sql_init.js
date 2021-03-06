// SQL
const sql = new SQL("Minecraft", "1.0", "我的世界游戏存档", 10*1024*1024),
	tableName = "world";
sql.setErrCallback(function(err){
	console.error("SQL运行出错：", err, err.message);
	//alert("SQL存档数据库 读取/写入 错误");
});
sql.createTable(tableName, [
	"type UNSIGNED TINYINT",
	"x INT",
	"y INT",
	"z INT",
	"id UNSIGNED FLOAT(5,2)",
	"attr TEXT"
]);

// 读取存档
function SQL_read(){
	sql.selectData(tableName, ["x", "y", "z", "id", "attr"], "type=1", function(result){
		if (result.length){
			deskgood.pos.x = result[0].x;
			deskgood.pos.y = result[0].y;
			deskgood.pos.z = result[0].z;
			deskgood.sensitivity = result[0].id;
			[deskgood.lookAt.left_right, deskgood.lookAt.top_bottom] = result[0].attr.split(" ").map(Number);
			deskgood.look_update();
		}
		console.log("load_condition(sql)", perload_condition+1)
		if (++perload_condition == 2){
			map.perloadChunk({
				progressCallback: (value)=>{
					$("#progress span").text( Math.round(value*100, 2).changeDecimalBuZero(2, 2) );
					$("#progress progress").val( value );
					if (ipcRenderer)
						ipcRenderer.send('progressUpdate', Math.min(value, 1));
				},
				finishCallback: ()=>{
					$("#progress span").text("100");
					$("#progress progress").val("1");
					deskgood.update_round_blocks();
					deskgood.update_round_blocks();
					setTimeout(function(){
						render(); //纹理贴图加载成功后，调用渲染函数执行渲染操作
						$("#progress").remove();
						if (ipcRenderer)
							ipcRenderer.send('progressUpdate', -1); //关闭进度条
					},0);
				}
			});
		}
	});
	sql.selectData(tableName, ["x", "y", "z"], "type=2", function(result){
		if (result.length){
			deskgood.v.x = result[0].x;
			deskgood.v.y = result[0].y;
			deskgood.v.z = result[0].z;
		}
	});
	sql.selectData(tableName, ["id", "attr"], "type=3 AND x=0", function(result){ //物品栏
		if (result.length){
			console.log(result)
			for (let i=0; i<result.length; i++){
				console.log(i, result[i])
				if (result[i].id == 0){
					deskgood.hold[i] = null;
				}else{
					deskgood.hold[i] = new Block({
						id: result[i].id,
						attr: JSON.parse("{"+result[i].attr+"}")
					});
				}
			}
			deskgood.hold.update();
		}
	});
	sql.selectData(tableName, ["id"], "type=3 AND x=1", function(result){ //选择物品
		if (result.length){
			deskgood.choice = result[0].id;
			deskgood.hold.update();
		}
	});
}

// 保存存档
function SQL_save(){
	sql.deleteData(tableName, "type=1", undefined, function(){
		sql.insertData(tableName, ["type", "x", "y", "z", "id", "attr"], [
			1,
			Math.round(deskgood.pos.x),
			Math.round(deskgood.pos.y),
			Math.round(deskgood.pos.z),
			deskgood.sensitivity,
			`"${deskgood.lookAt.left_right} ${deskgood.lookAt.top_bottom}"`
		]);
	});
	sql.deleteData(tableName, "type=2", undefined, function(){
		sql.insertData(tableName, ["type", "x", "y", "z"], [
			2,
			Math.round(deskgood.v.x),
			Math.round(deskgood.v.y),
			Math.round(deskgood.v.z)
		]);
	});
	sql.deleteData(tableName, "type=3", undefined, function(){
		for (let i of deskgood.hold){
			console.log(
				(i? JSON.stringify(i.attr).slice(1,-1): "")+
				"\n"+
				(i? `'${JSON.stringify(i.attr).slice(1,-1)}'`: '""')
			)
			sql.insertData(tableName, ["type", "x", "id", "attr"], [
				3,
				0, //物品栏
				i? i.id: 0,
				i? `'${JSON.stringify(i.attr).slice(1,-1)}'`: '""'
			]);
		}
		sql.insertData(tableName, ["type", "x", "id"], [
			3,
			1, //选择物品
			deskgood.choice
		]);
	});
	
	console.log("存档+1中……");
}

setInterval(SQL_save, 10*1000); // 10s
document.addEventListener("background", SQL_save, false); //plus切换到后台时自动保存