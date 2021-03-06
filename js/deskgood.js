/**
* 玩家(deskgood)
*/
let delay_id = {
	update_block: null,
	perloadChunk: null
}, body_blocks = [];
let deskgood = {
	v: {
		x: 0,
		y: 0,
		z: 0
	},
	pos: camera.position,
	/*size: {
		"x+": 50,
		"x-": 50,
		"y+": 50,
		"y-": 150,
		"z+": 50,
		"z-": 50
	},*/
	jump_v: 5,
	up: camera.up,
	lookAt: {
		left_right: 0,
		top_bottom: -10,
		/* _left_right: 0,
		_top_bottom: -10,
		get left_right(){
			return this._left_right;
		},
		set left_right(value){
			this._left_right = value;
			deskgood.look_update();
		},
		get top_bottom(){
			return this._top_bottom;
		},
		set top_bottom(value){
			this._top_bottom = value;
			deskgood.look_update();
		} */
	},
	look: {
		x: 1,
		y: 0,
		z: 0
	},
	sensitivity: device? 2.6: 1, //灵敏度：手机2，电脑1
	handLength: 360, //手长（谐音手残）
	choice: 0,
	hold: new ThingGroup($("#tools")[0], {
		fixedLength: 4,
		updateCallback(children){
			for (let i in children){
				$(children[i]).css("borderColor", (i==deskgood.choice)?"#fff":"#aaa")
					.css("borderWidth", (i==deskgood.choice)?"0.6vmax":"0.5vmax")
					.css("transform", (i==deskgood.choice)?"translateY(-3px)":"")
					.css("margin", "0 0");
				children[i].onclick = ()=>{
					let before = deskgood.choice;
					
					if ( deskgood.hold[before] &&
						eval( deskgood.hold[before].get("attr", "onChangeLeave") ) === false
					) return;
					
					deskgood.choice = i;
					
					if ( deskgood.hold[i] &&
						eval( deskgood.hold[i].get("attr", "onChangeTo") ) === false
					) return (deskgood.choice = before);
					
					deskgood.hold.update();
				};
			}
			children.push(
				$("<li></li>").append( $("<img/>").attr("src", "./img/more.png") )
				.click(()=>state("bag"))[0]
			);
		}
	}),
	head: new ThingGroup($("#bag .head")[0], {
		fixedLength: 1,
		maxLength: Infinity,
		updateCallback(children){
			for (let i in children){
				$(children[i]).css("borderColor", (i==children.length-1)?"#aaa":"rgb(116,116,116)")
					.css("borderWidth", (i==children.length-1)?"0.5vmax":"0.3vmax")
					.css("margin", "0 0");
				children[i].onclick = ()=>{
					if (deskgood.head[i]){ //有方块（放到手上）
						if ( deskgood.head[deskgood.head.length-1] &&
							eval( deskgood.head[deskgood.head.length-1].get("attr", "onHold") ) === false
						) return;
						
						deskgood.hold.addOne(deskgood.head[deskgood.head.length-1], deskgood.choice);
						deskgood.head.delete();
					}else{ //无方块
						let choice = deskgood.hold[deskgood.choice];
						if ( !choice ) return; //手上无方块
						
						if (eval( choice.get("attr", "onPutToHead") ) === false)
							return;
						
						deskgood.head.addOne( choice );
						deskgood.hold.delete(1, deskgood.choice);
					}
				};
			}
		}
	}),
	body: new ThingGroup($("#bag .body")[0], {
		fixedLength: 1,
		maxLength: Infinity,
		updateCallback(children){
			for (let i in children){
				$(children[i]).css("borderColor", (i==children.length-1)?"#aaa":"rgb(116,116,116)")
					.css("borderWidth", (i==children.length-1)?"0.5vmax":"0.3vmax")
					.css("margin", "0 0");
				children[i].onclick = ()=>{
					if (deskgood.body[i]){ //有方块（放到手上）
						if ( deskgood.body[deskgood.body.length-1] &&
							eval( deskgood.body[deskgood.body.length-1].get("attr", "onHold") ) === false
						) return;
						
						deskgood.hold.addOne(deskgood.body[deskgood.body.length-1], deskgood.choice);
						deskgood.body.delete();
					}else{ //无方块
						let choice = deskgood.hold[deskgood.choice];
						if ( !choice ) return; //手上无方块
						
						if (eval( choice.get("attr", "onPutToBody") ) === false)
							return;
						
						deskgood.body.addOne( choice );
						deskgood.hold.delete(1, deskgood.choice);
					}
				};
			}
		}
	}),
	leg: new ThingGroup($("#bag .leg")[0], {
		fixedLength: 1,
		maxLength: Infinity,
		updateCallback(children){
			for (let i in children){
				$(children[i]).css("borderColor", (i==children.length-1)?"#aaa":"rgb(116,116,116)")
					.css("borderWidth", (i==children.length-1)?"0.5vmax":"0.3vmax")
					.css("margin", "0 0");
				children[i].onclick = ()=>{
					if (deskgood.leg[i]){ //有方块（放到手上）
						if ( deskgood.leg[deskgood.leg.length-1] &&
							eval( deskgood.leg[deskgood.leg.length-1].get("attr", "onHold") ) === false
						) return;
						
						deskgood.hold.addOne(deskgood.leg[deskgood.leg.length-1], deskgood.choice);
						deskgood.leg.delete();
					}else{ //无方块
						let choice = deskgood.hold[deskgood.choice];
						if ( !choice ) return; //手上无方块
						
						console.log(choice, TEMPLATES, choice.get("attr", "onPutToLeg"))
						if ( eval( choice.get("attr", "onPutToLeg") ) === false )
							return;
						
						deskgood.leg.addOne( choice );
						deskgood.hold.delete(1, deskgood.choice);
					}
				};
			}
		}
	}),
	foot: new ThingGroup($("#bag .foot")[0], {
		fixedLength: 1,
		maxLength: Infinity,
		updateCallback(children){
			for (let i in children){
				$(children[i]).css("borderColor", (i==children.length-1)?"#aaa":"rgb(116,116,116)")
					.css("borderWidth", (i==children.length-1)?"0.5vmax":"0.3vmax")
					.css("margin", "0 0");
				children[i].onclick = ()=>{
					if ( deskgood.foot[deskgood.foot.length-1] &&
							eval( deskgood.foot[deskgood.foot.length-1].get("attr", "onHold") ) === false
						) return;
						
					if (deskgood.foot[i]){ //有方块（放到手上）
						deskgood.hold.addOne(deskgood.foot[deskgood.foot.length-1], deskgood.choice);
						deskgood.foot.delete();
					}else{ //无方块
						let choice = deskgood.hold[deskgood.choice];
						if ( !choice ) return; //手上无方块
						
						if (eval( choice.get("attr", "onPutToFoot") ) === false)
							return;
						
						deskgood.foot.addOne( choice );
						deskgood.hold.delete(1, deskgood.choice);
					}
				};
			}
		}
	}),
	// 死亡
	die(reason="使用命令自杀"){
		sql.deleteTable(tableName, undefined, function(){
			localStorage.removeItem("我的世界_seed");
			
			document.exitPointerLock(); //取消鼠标锁定
			gui.close(); //隐藏gui
			$("#help, #warn").hide(); //隐藏 遮罩、横屏提示
			$("#die")
				.css("display", "block")
				.children(".resaon").html(reason);
			$("#die").hide().fadeIn("slow");
			
			let bgm = $("#bgm")[0];
			bgm.volume = 1;
			bgm.src = "./music/凉凉.mp3";
			bgm.play();
			
			console.warn("deskgood死亡");
		});
	},
	// 视角更新
	look_update(x,y,z){
		if (x !== undefined || y !== undefined || z !== undefined){
			x = x||deskgood.look.x,
			y = y||deskgood.look.y,
			z = z||deskgood.look.z;
			let v = new THREE.Vector3(x,y,z).setLength(1); //单位向量（标准化）
			camera.lookAt(deskgood.pos.x+v.x, deskgood.pos.y+v.y, deskgood.pos.z+v.z);
			[deskgood.look.x, deskgood.look.y, deskgood.look.z] = [v.x, v.y, v.z];
		}else{
			let x =
				Math.cos(deskgood.lookAt.left_right/180*Math.PI)*
				Math.cos(deskgood.lookAt.top_bottom/180*Math.PI)
			;
			let z =
				Math.sin(deskgood.lookAt.left_right/180*Math.PI)*
				Math.cos(deskgood.lookAt.top_bottom/180*Math.PI)
			;
			let y = Math.sin(deskgood.lookAt.top_bottom/180*Math.PI);
			camera.lookAt(deskgood.pos.x+x, deskgood.pos.y+y, deskgood.pos.z+z);
			[deskgood.look.x, deskgood.look.y, deskgood.look.z] = [x,y,z];
		}
	},
	update_round_blocks(dx=1, dy=1, dz=1){
		for (let i of body_blocks)
			if (i)
				map.update(i.x, i.y, i.z); //重新更新
		
		body_blocks = [];
		for (let x=deskgood.pos.x/100-dx; x<=deskgood.pos.x/100+dx; x++)
			for (let y=deskgood.pos.y/100-1-dy; y<=deskgood.pos.y/100+dy; y++)
				for (let z=deskgood.pos.z/100-dz; z<=deskgood.pos.z/100+dz; z++)
					body_blocks.push({x, y, z});
		
		for (let i of body_blocks){
			//[i.x, i.y, i.z] = [i.x, i.y, i.z].map(Math.round)
			let block = map.get(i.x, i.y, i.z);
			//if (i.x == 9 && i.y == 0 && i.z == 26) console.warn(block);
			if (!block) continue;
			
			block.block.material.forEach((item, index, arr) => {
				arr[index].visible = true;
			}); //显示所有
			//if (i.x == 9 && i.y == 0 && i.z == 26) console.warn(block.block.material.map(v => v.visible));
			// console.info("显示面", i, [i.x,i.y,i.z].map(Math.round), block);
			if (!block.block.addTo){
				//if (i.x == 9 && i.y == 0 && i.z == 26) console.warn("add", block.block.addTo);
				scene.add(block.block.mesh);
				block.block.addTo = true;
				// console.info("显示体", i, [i.x,i.y,i.z].map(Math.round), block);
			}
		}
	},
	// 移动
	move (x=deskgood.pos.x, y=deskgood.pos.y, z=deskgood.pos.z){
		/*[x, z] = [x, z].map(
			value => value+(0.1*Math.random()-0.05)
		); //随机化*/
		
		if (
			map.get(x/100, y/100, z/100) !== undefined && //不能移动到未加载的方块
			map.initedChunk.some((item, index, value)=>{
				return item[0] == Math.round(x/100/map.size.x) &&
					item[1] == Math.round(z/100/map.size.z);
			}) //含有（已加载和加载中的区块）
		){
			/* if (
				(
					map.get(deskgood.pos.x/100, deskgood.pos.y/100, deskgood.pos.z/100) && //有方块在头上
					(
						map.get(deskgood.pos.x/100, deskgood.pos.y/100, deskgood.pos.z/100).get("attr", "block", "through") || //可穿透
						map.get(deskgood.pos.x/100, deskgood.pos.y/100, deskgood.pos.z/100).get("attr", "block", "transparent") //透明
					)
				) || !map.get(deskgood.pos.x/100, deskgood.pos.y/100, deskgood.pos.z/100) //没有方块在头上
			){ */
				let changed_x_z = deskgood.pos.x != x || deskgood.pos.z != z, //改变了x|z坐标
					changed = changed_x_z || deskgood.pos.y != y;
				
				[deskgood.pos.x, deskgood.pos.y, deskgood.pos.z] = [x,y,z];
				
				//perloadChunk
				if (changed_x_z){
					if (!delay_id.perloadChunk)
						delay_id.perloadChunk =  setTimeout(()=>{
							map.perloadChunk();
							delay_id.perloadChunk = null;
						}, 100);
				}
				//更新周围方块
				if (changed){
					if (!delay_id.update_block){
						delay_id.update_block = setTimeout(()=>{
							deskgood.update_round_blocks();
							delay_id.update_block = null;
						}, 36);
					}
				}
			/* }else{
				deskgood.v.y = 0;
				throw "";
			} */
		}else{
			// throw "block";
			print("区块未加载完成", "区块暂未加载完成，禁止进入<br/>（想加载快可以调节区块预加载范围，只要不卡死就行）", 1);
		}
	},
	// 前进
	go (x=0, y=0, z=0){
		x = x*rnd_error(),
		y = y*rnd_error(),
		z = z*rnd_error(); //随机化
		
		let rt = [0,0,0]; //返回值
		
		if (y<0 && map.get(
			deskgood.pos.x/100,
			deskgood.pos.y/100-1,
			deskgood.pos.z/100
		)){ //腿上有方块
			console.warn("卡住leg go不了");
			rt[1] = y;
			y = 0;
		}
		
		//X
		if (x > 0){
			//上半身
			let objs = ray3D(
				{x: deskgood.pos.x-50},
				{x: 1},
				0,
				x+60
			).filter(value => value.object.userData.through != true);
			if (objs.length){ //被阻挡
				let fx = Math.min(...objs.map(v => v.point.x))-10; //获取碰撞点，计算移动位置
				rt[0] = fx-(deskgood.pos.x+x);
				deskgood.moveX(fx);
				console.log("x+ 上 碰撞",x, objs, objs.map(v => v.object.position), objs.map(v => v.point.x), fx, rt[0])
			}else{ //无阻挡
				deskgood.moveX(deskgood.pos.x+x);
			}
			//下半身
			objs = ray3D(
				{x: deskgood.pos.x-50, y: deskgood.pos.y-100},
				{x: 1},
				0,
				x+60
			).filter(value => value.object.userData.through != true);
			if (objs.length){ //被阻挡
				let fx = Math.min(...objs.map(v => v.point.x))-10; //获取碰撞点，计算移动位置
				rt[0] = fx-(deskgood.pos.x+x);
				deskgood.moveX(fx);
				console.log("x+ 下 碰撞",x, objs, objs.map(v => v.object.position), objs.map(v => v.point.x), fx, rt[0])
			}else{ //无阻挡
				deskgood.moveX(deskgood.pos.x+x);
			}
		}else if (x < 0){
			//上半身
			let objs = ray3D(
				{x: deskgood.pos.x+50},
				{x: -1},
				0,
				-x+60
			).filter(value => value.object.userData.through != true);
			if (objs.length){ //被阻挡
				let fx = Math.max(...objs.map(v => v.point.x))+10; //获取碰撞点，计算移动位置
				rt[0] = fx-(deskgood.pos.x+x);
				deskgood.moveX(fx);
				console.log("x- 上 碰撞",x, objs, objs.map(v => v.object.position), objs.map(v => v.point.x), fx, rt[0])
			}else{ //无阻挡
				deskgood.moveX(deskgood.pos.x+x);
				// console.log("x- 上 无碰撞",x)
			}
			//下半身
			objs = ray3D(
				{x: deskgood.pos.x+50, y: deskgood.pos.y-100},
				{x: -1},
				0,
				-x+60
			).filter(value => value.object.userData.through != true);
			if (objs.length){ //被阻挡
				let fx = Math.max(...objs.map(v => v.point.x))+10; //获取碰撞点，计算移动位置
				rt[0] = fx-(deskgood.pos.x+x);
				deskgood.moveX(fx);
				console.log("x- 下 碰撞",x, objs, objs.map(v => v.object.position), objs.map(v => v.point.x), fx, rt[0])
			}else{ //无阻挡
				deskgood.moveX(deskgood.pos.x+x);
				// console.log("x- 下 无碰撞",x)
			}
		}
		
		//Y
		if (y > 0){ //上
			let objs = ray3D(
				{y: deskgood.pos.y+50},
				{y: 1},
				0,
				y
			).filter(value => value.object.userData.through != true);
			if (objs.length){ //被阻挡
				/*let fy = Math.min(...ray3D(
					{y: deskgood.pos.y+50},
					{y: 1}
				).map(v => v.point.y))-50;*/
				let fy = Math.min(...objs.map(v => v.point.y))-50; //获取碰撞点，计算移动位置
				rt[1] = fy-(deskgood.pos.y+y);
				deskgood.moveY(fy);
			}else{ //无阻挡
				deskgood.moveY(deskgood.pos.y+y);
			}
		}else if (y < 0){ //下
			let objs = ray3D(
				{y: deskgood.pos.y-150},
				{y: -1},
				0,
				-y
			).filter(value => value.object.userData.through != true);
			if (objs.length){ //被阻挡
				/*let fy = Math.max(...ray3D(
					{y: deskgood.pos.y-150},
					{y: -1}
				).map(v => v.point.y))+150;*/
				let fy = Math.max(...objs.map(v => v.point.y))+150; //获取碰撞点，计算移动位置
				rt[1] = fy-(deskgood.pos.y+y);
				deskgood.moveY(fy);
			}else{ //无阻挡
				deskgood.moveY(deskgood.pos.y+y);
			}
		}
		
		//z
		if (z > 0){
			//上半身
			let objs = ray3D(
				{z: deskgood.pos.z-50},
				{z: 1},
				0,
				z+60
			).filter(value => value.object.userData.through != true);
			if (objs.length){ //被阻挡
				let fz = Math.min(...objs.map(v => v.point.z))-10; //获取碰撞点，计算移动位置
				rt[2] = fz-(deskgood.pos.z+z);
				deskgood.moveZ(fz);
				console.log("z+ 上 碰撞",z, objs, objs.map(v => v.object.position), objs.map(v => v.point.z), fz, rt[2])
			}else{ //无阻挡
				deskgood.moveZ(deskgood.pos.z+z);
			}
			//下半身
			objs = ray3D(
				{z: deskgood.pos.z-50, y: deskgood.pos.y-100},
				{z: 1},
				0,
				z+60
			).filter(value => value.object.userData.through != true);
			if (objs.length){ //被阻挡
				let fz = Math.min(...objs.map(v => v.point.z))-10; //获取碰撞点，计算移动位置
				rt[2] = fz-(deskgood.pos.z+z);
				deskgood.moveZ(fz);
				console.log("z+ 下 碰撞",z, objs, objs.map(v => v.object.position), objs.map(v => v.point.z), fz, rt[2])
			}else{ //无阻挡
				deskgood.moveZ(deskgood.pos.z+z);
			}
		}else if (z < 0){
			//上半身
			let objs = ray3D(
				{z: deskgood.pos.z+50},
				{z: -1},
				0,
				-z+60
			).filter(value => value.object.userData.through != true);
			if (objs.length){ //被阻挡
				let fz = Math.max(...objs.map(v => v.point.z))+10; //获取碰撞点，计算移动位置
				rt[2] = fz-(deskgood.pos.z+z);
				deskgood.moveZ(fz);
				console.log("z- 上 碰撞",z, objs, objs.map(v => v.object.position), objs.map(v => v.point.z), fz, rt[2])
			}else{ //无阻挡
				deskgood.moveZ(deskgood.pos.z+z);
				// console.log("z- 上 无碰撞",z)
			}
			//下半身
			objs = ray3D(
				{z: deskgood.pos.z+50, y: deskgood.pos.y-100},
				{z: -1},
				0,
				-z+60
			).filter(value => value.object.userData.through != true);
			if (objs.length){ //被阻挡
				let fz = Math.max(...objs.map(v => v.point.z))+10; //获取碰撞点，计算移动位置
				rt[2] = fz-(deskgood.pos.z+z);
				deskgood.moveZ(fz);
				console.log("z- 下 碰撞",z, objs, objs.map(v => v.object.position), objs.map(v => v.point.z), fz, rt[2])
			}else{ //无阻挡
				deskgood.moveZ(deskgood.pos.z+z);
				// console.log("z- 下 无碰撞",z)
			}
		}
		
		return rt;
		
		/*if (x & z)
			console.log(x,y,z);
		
		let rt = [false, false, false];
		//x
		if (x > 0){ //向前
			for (var i=deskgood.pos.x; i<=deskgood.pos.x+x; i+=dx){
				if (map.get(i/100,
						deskgood.pos.y/100,
						deskgood.pos.z/100)
					!=
						null
				){
					rt[0] = true;
					console.log("撞到脸，s:"+((deskgood.pos.x+x)-i));
					break;
				}
				if (map.get((i+10)/100,
						deskgood.pos.y/100-1,
						deskgood.pos.z/100)
					!=
						null
				){
					rt[0] = true;
					console.log("撞到脚，s:"+((deskgood.pos.x+x)-i));
					break;
				}
			}
			deskgood.pos.x = i;
		}else if (x < 0){ //向后
			for (var i=deskgood.pos.x; i>=deskgood.pos.x+x; i-=dx){
				if (map.get((i-10)/100,
						deskgood.pos.y/100,
						deskgood.pos.z/100)
					!=
						null
				){
					rt[0] = true;
					console.log("撞到后脑，s:"+(i-(deskgood.pos.x+x)));
					break;
				}
				if (map.get((i-10)/100,
						deskgood.pos.y/100-1,
						deskgood.pos.z/100)
					!=
						null
				){
					rt[0] = true;
					console.log("撞到脚，s:"+(i-(deskgood.pos.x+x)));
					break;
				}
			}
			deskgood.pos.x = i;
		}
		//y
		if (y > 0){ //向上
			for (var j=deskgood.pos.y; j<=deskgood.pos.y+y; j+=dy){
				if (map.get(deskgood.pos.x/100,
						j/100,
						deskgood.pos.z/100)
					!=
						null
				){
					rt[1] = true;
					let s = (deskgood.pos.y-150+y)-j;
					if (s)
						console.log("撞到天花板，s:", s);
					break;
				}
			}
			deskgood.pos.y = j;
		}else if (y < 0){ //向下
			for (var j=deskgood.pos.y-150; j>=deskgood.pos.y-150+y; j-=dy){
				if (map.get(deskgood.pos.x/100,
						j/100,
						deskgood.pos.z/100)
					!=
						null
				){
					rt[1] = true;
					let s = j-(deskgood.pos.y-150+y);
					if (s)
						// console.log("撞到地面，s:", s);
					break;
				}
			}
			deskgood.pos.y = j+150;
		}
		
		//z
		if (z > 0){ //向右
			for (var k=deskgood.pos.z; k<=deskgood.pos.z+z; k+=dz){
				if (map.get((k+10)/100,
						deskgood.pos.y/100,
						deskgood.pos.z/100)
					!=
						null
				){
					rt[2] = true;
					console.log("撞到头，s:"+((deskgood.pos.z+z)-i));
					break;
				}
				if (map.get((k+10)/100,
						deskgood.pos.y/100-1,
						deskgood.pos.z/100)
					!=
						null
				){
					rt[2] = true;
					console.log("撞到腿，s:"+((deskgood.pos.z+z)-k));
					break;
				}
			}
			deskgood.pos.z = k;
		}else if (z < 0){ //向左
			for (var k=deskgood.pos.z; k>=deskgood.pos.z+z; k-=dz){
				if (map.get((k-10)/100,
						deskgood.pos.y/100,
						deskgood.pos.z/100)
					!=
						null
				){
					rt[2] = true;
					console.log("撞到头，s:"+(k-(deskgood.pos.z+z)));
					break;
				}
				if (map.get((k-10)/100,
						deskgood.pos.y/100-1,
						deskgood.pos.z/100)
					!=
						null
				){
					rt[2] = true;
					console.log("撞到腿，s:"+(k-(deskgood.pos.z+z)));
					break;
				}
			}
			deskgood.pos.z = k;
		}
		return rt;*/
	},
	
	// 放置方块
	place(block, {x, y, z}){ // 单位 px=cm
		x = Math.round(x),
		y = Math.round(y),
		z = Math.round(z);
		
		if (
			map.get(x, y, z) &&
			eval(map.get(x, y, z).get("attr", "block", "onPut")) === false
		) return;
		
		console.log("deskgood.place", {x,y,z}, block.id, block.attr)
		
		map.addID(block.id, {x,y,z}, TEMPLATES);
		
		let attr = `'${JSON.stringify(map.get(x, y, z).attr).slice(1,-1)}'`,
			cX = Math.round(x/map.size.x),
			cZ = Math.round(z/map.size.z);
		map.chunks[cX][cZ].edit = map.chunks[cX][cZ].edit.filter(v =>
			v.x != x &&
			v.y != y &&
			v.z != z
		); //删除重复
		/*for (let [i, item] of Object.entries(map.chunks[cX][cZ].edit) )
			if (
				item.x == x &&
				item.y == y &&
				item.z == z
			) map.chunks[cX][cX].edit.splice(i,1); //删除重复*/
		map.chunks[cX][cZ].edit.push({
			x,
			y,
			z,
			id: block.id,
			attr
		}); //添加edit
		map.updateRound(x, y, z); //刷新方块及周围
		
		x = Math.round(x),
		y = Math.round(y),
		z = Math.round(z); //存储必须整数
		//SQL
		sql.deleteData(tableName, `type=0 AND x=${x} AND y=${y} AND z=${z}`, undefined, ()=>{
			sql.insertData(tableName, ["type", "x", "y", "z", "id", "attr"], [
				0,
				x,
				y,
				z,
				block.id,
				attr
			])
		});
	},
	
	// 移除方块
	remove({x, y, z}){ // 单位 px=cm
		x = Math.round(x),
		y = Math.round(y),
		z = Math.round(z);
		
		if (
			map.get(x, y, z) &&
			eval(map.get(x, y, z).get("attr", "block", "onDelete")) === false
		) return;
		
		console.log("deskgood.remove", {x,y,z}, map.get(x, y, z))
		
		map.delete(x, y, z); //删除方块
		
		let cX = Math.round(x/map.size.x),
			cZ = Math.round(z/map.size.z);
		map.chunks[cX][cZ].edit = map.chunks[cX][cZ].edit.filter(v =>
			v.x != x &&
			v.y != y &&
			v.z != z
		); //删除重复
		/*for (let [i, item] of Object.entries(map.chunks[cX][cZ].edit) )
			if (
				item.x == x &&
				item.y == y &&
				item.z == z
			) map.chunks[cX][cZ].edit.splice(i,1); //删除重复*/
		map.chunks[cX][cZ].edit.push({
			x,
			y,
			z,
			id: 0
		}); //添加edit
		map.updateRound(x, y, z); //刷新方块及周围
		
		x = Math.round(x),
		y = Math.round(y),
		z = Math.round(z); //存储必须整数
		//SQL
		sql.deleteData(tableName, `type=0 AND x=${x} AND y=${y} AND z=${z}`, undefined, function(){
			sql.insertData(tableName, ["type", "x", "y", "z", "id"], [
				0,
				x,
				y,
				z,
				0
			]);
		});
	}
}
deskgood.moveTo = deskgood.move;
deskgood.moveX = x=>deskgood.move(x);
deskgood.moveY = y=>deskgood.move(undefined, y);
deskgood.moveZ = z=>deskgood.move(undefined, undefined, z);
deskgood.goX = x=>deskgood.go(x);
deskgood.goY = y=>deskgood.go(0,y);
deskgood.goZ = z=>deskgood.go(0,0,z);

SQL_read(); //读取存档

//初始化


//gui
if (DEBUG){
	let deskgood_folder = gui.addFolder("玩家/观察者(deskgood)");
	deskgood_folder.open();
		deskgood_folder.add(window, "stop").listen();
		deskgood_folder.add(deskgood, "die").name("Game Over(自杀)");
		deskgood_folder.add(deskgood, "sensitivity", 0.1, 10).name("灵敏度");
		deskgood_folder.add(deskgood, "jump_v", 1, 36).name("跳跃速度");
		let deskgood_position_folder = deskgood_folder.addFolder("位置/px");
		deskgood_position_folder.open();
			deskgood_position_folder.add(deskgood.pos, "x", map.size[0].x*100, map.size[1].x*100, 0.01).listen();
			deskgood_position_folder.add(deskgood.pos, "y", map.size[0].y*100, map.size[1].y*100, 0.01).listen();
			deskgood_position_folder.add(deskgood.pos, "z", map.size[0].z*100, map.size[1].z*100, 0.01).listen();
			let deskgood_position_zone_folder = deskgood_position_folder.addFolder("区块(Chunk)");
			deskgood_position_zone_folder.open();
				deskgood_position_folder.add({
					get x(){ return Math.round(deskgood.pos.x/100/map.size.x) },
					set x(v){ deskgood.pos.x = v*100*map.size.x }
				}, "x", -100, 100, 1).listen();
				deskgood_position_folder.add({
					get z(){ return Math.round(deskgood.pos.z/100/map.size.z) },
					set z(v){ deskgood.pos.z = v*100*map.size.z }
				}, "z", -100, 100, 1).listen();
		let deskgood_v_folder = deskgood_folder.addFolder("速度/(m/s)");
			deskgood_v_folder.add(deskgood.v, "x", -10, 10, 1e-3).listen();
			deskgood_v_folder.add(deskgood.v, "y", -100, 100, 1e-3).listen().onChange((value) => {
				deskgood.v.y = (value/100)**3 *100;
			});
			deskgood_v_folder.add(deskgood.v, "z", -10, 10, 1e-3).listen();
		let deskgood_lookAt_folder = deskgood_folder.addFolder("朝向（球坐标系）");
			deskgood_lookAt_folder.add(deskgood.lookAt, "left_right", 0, 360).listen().name("左右（水平）");
			deskgood_lookAt_folder.add(deskgood.lookAt, "top_bottom", -90, 90).listen().name("上下（竖直）");
		let deskgood_look_folder = deskgood_folder.addFolder("朝向（笛卡尔坐标系）");
			deskgood_look_folder.add(deskgood.look, "x", -1, 1, 0.01).listen().onChange(x => deskgood.look_update(x));
			deskgood_look_folder.add(deskgood.look, "y", -1, 1, 0.01).listen().onChange(y => deskgood.look_update(undefined, y));
			deskgood_look_folder.add(deskgood.look, "z", -1, 1, 0.01).listen().onChange(z => deskgood.look_update(undefined, undefined, z));
		let deskgood_up_folder = deskgood_folder.addFolder("天旋地转（小心头晕）");
			deskgood_up_folder.add(deskgood.up, "x", -1, 1, 0.01).onChange(function(){
				print("头晕", "<font style='font-size: 16px;'>头晕别怪我</font>", 3);
				/* plus.nativeUI.toast(
					"<font size=\"16\">头晕别怪我</font>",
					{
						type: "richtext",
						verticalAlign: "top",
						richTextStyle: {align:"center"}
					}
				); }catch(err){} */
			});
			deskgood_up_folder.add(deskgood.up, "y", -1, 1, 0.01).onChange(function(){
				print("头晕", "<font style='font-size: 16px;'>头晕别怪我</font>", 3);
					/* plus.nativeUI.toast(
						"<font size=\"16\">头晕别怪我</font>",
						{
							type: "richtext",
							verticalAlign: "top",
							richTextStyle: {align:"center"}
						}
					); }catch(err){} */
				});
			deskgood_up_folder.add(deskgood.up, "z", -1, 1, 0.01).onChange(function(){
				print("头晕", "<font style='font-size: 16px;'>头晕别怪我</font>", 3);
					/* plus.nativeUI.toast(
						"<font size=\"16\">头晕别怪我</font>",
						{
							type: "richtext",
							verticalAlign: "top",
							richTextStyle: {align:"center"}
						}
					); }catch(err){} */
				});
		let deskgood_hold_folder = deskgood_folder.addFolder("工具栏(tools)");
		deskgood_hold_folder.open();
			deskgood_hold_folder.add(deskgood, "choice", 0, 3, 1).listen().name("选择工具").onChange(deskgood.hold.update);
			let deskgood_hold_things_folder = deskgood_hold_folder.addFolder("物品(只读勿编辑)");
			deskgood_hold_things_folder.open();
				deskgood_hold_things_folder.add(deskgood.hold[0] || {id:0}, "id").name("0").listen().onChange(deskgood.hold.update);
				deskgood_hold_things_folder.add(deskgood.hold[1] || {id:0}, "id").name("1").listen().onChange(deskgood.hold.update);
				deskgood_hold_things_folder.add(deskgood.hold[2] || {id:0}, "id").name("2").listen().onChange(deskgood.hold.update);
				deskgood_hold_things_folder.add(deskgood.hold[3] || {id:0}, "id").name("3").listen().onChange(deskgood.hold.update);
}

/*
* 天堂、地狱
*/
setInterval(function(){
	if (deskgood.v.y == Infinity && deskgood.pos.y == Infinity){
		document.body.innerHTML = "";
		document.write(`
<body style="background-color: black; color: rgb(200,200,200); margin:0; padding:0;">
<h1 style="font-size:16vmin; width:100%; margin:0; text-align:center; position:absolute; top:50%; transform:translateY(-50%);">欢迎来到天堂！<br/>welcome to Infinity.</h1>
		`);
		setTimeout(()=>{
			deskgood.die("上天堂");
		},3*1000*rnd_error());
	}else if (deskgood.pos.y < -1800*100){
		document.body.innerHTML = "";
		document.write(`
<body style="background-color: black; color: white; margin:0; padding:0;">
<h1 style="font-size:16vmin; width:100%; margin:0; text-align:center; position:absolute; top:50%; transform:translateY(-50%);">欢迎来到地狱！<br/>welcome to L-18.</h1>
		`);
		setTimeout(()=>{
			deskgood.die("下地狱");
		},3*1000*rnd_error());
	}
},1000);