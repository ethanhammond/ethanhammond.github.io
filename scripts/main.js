/*
 * Ethan Hammond
 * 10/4/2016
 * Load CAD Files with file selection.
 * TODO: Add Loading gif
 */

"use strict";

var object, stl, ply;

function loadPartials() {
    $('#header').load('header.html');
    $('#footer').load('footer.html');
}

function loadInterface() {
    $(".viewer").hide();
    $(".homeScreen").show();
}

function awaitButtonClicks() {
    $(".heatsink").click( function() {
        alert("click");
        object = "Heatsink";
        stl = true;
        $(".viewer").show();
        $(".footer").hide();
        $(".navbar").hide();
        $(".homeScreen").hide();
        init();
    });

    $(".gfxcard").click( function() {
        object = "gfxcard";
        stl = true;
        $(".viewer").show();
        $(".footer").hide();
        $(".navbar").hide();
        $(".homeScreen").hide();
        init();
    });

    $(".v10head").click(function() {
        object = "v10head";
        stl = true;
        $(".viewer").show();
        $(".footer").hide();
        $(".navbar").hide();
        $(".homeScreen").hide();
        init();
    });

    $(".model").click(function() {
        object = "model";
        ply = true;
        $(".viewer").show();
        $(".footer").show();
        $(".navbar").hide();
        $(".homeScreen").hide();
        init();
    });
}

function init() {
    var stats = initStats();

    //Create a new scene
    var scene = new THREE.Scene();

    //Set camera position
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    //Create renderer and set size
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColorHex(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;

    //Set ground plane size and color
    var planeGeometry = new THREE.PlaneBufferGeometry(0,0,0,0);
    var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

    //Position the plane and add it to the scene
    var plane = new THREE.Mesh(planeGeometry,planeMaterial);
    plane.rotation.x = 0;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = false;
    scene.add(plane);

    //Set camera position and orientation
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;
    camera.lookAt(scene.position);

    //Create pointlight aimed at objects and add to scene
    var topLight = new THREE.PointLight(0xffffff);
    topLight.position.set( 40, -60, -20);
    scene.add(topLight);

    //Create pointlight aimed at objects and add to scene
    var bottomLight = new THREE.PointLight(0xffffff);
    bottomLight.position.set(40, 60, 20);
    scene.add(bottomLight);

    window.addEventListener( 'resize', onWindowResize, false );

    //Add coordinate axis
    var axes = new THREE.AxisHelper( 100 );
     scene.add(axes);

    if (stl == true) {
        //Load STL file from fixed location
        var stlLoader = new THREE.STLLoader();
        stlLoader.addEventListener('load', function (event){
            var geometry = event.content;
            var material = new THREE.MeshLambertMaterial({color: 0xD3D3D3});
            var mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = Math.PI;
            var box = new THREE.Box3().setFromObject(mesh);
            var length, width, height;
            length = box.size().x;
            height = box.size().y;
            width = box.size().z;
            mesh.position.x = 0;
            mesh.position.y = 0;
            mesh.position.z = 0;
            console.log(length,width,height);
            scene.add(mesh);
        });
        // STL file to be loaded
        stlLoader.load("./assets/"+object+".stl");
    } else if (ply == true) {
        var loader = new THREE.PLYLoader();
        loader.load( './assets/model.ply', function ( geometry ) {
            geometry.computeFaceNormals();
            var material = new THREE.MeshLambertMaterial( { color: 0x0055ff } );
            var mesh = new THREE.Mesh( geometry, material );
            mesh.position.y = - 0.25;
            mesh.rotation.x = - Math.PI / 2;
            mesh.scale.multiplyScalar( 0.25 );
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            scene.add( mesh );
        } );
    }

    //Place output of renderer in HTML
    $("#WebGL-output").append(renderer.domElement);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    //Prep for animations
    animate();

    function animate() {
        requestAnimationFrame( animate );
        controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
        stats.update();
        render();
    }

    function render() {
        renderer.render( scene, camera );
        requestAnimationFrame(render);
    }

    function initStats() {
        var stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        $("#Stats-output").append( stats.domElement );
        return stats;
    }
}

window.onload = function() {
    loadPartials();
    loadInterface();
    awaitButtonClicks();
};

