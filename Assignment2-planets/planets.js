
var canvas;
var gl;
var vColor;
var vPosition;

var num_vertices = 0;
var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);
var aHead = mat4();
var tempcam = mat4();

var fov = 45;
var attach = 0;
var pointsArray = [];
var trueNormalsArray = [];
var vertexNormalsArray = [];

var lightPosition = vec4(1.0, 1.0, 1.0, 1.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 20.0;

var ambientColor, diffuseColor, specularColor;


camera_transform = mat4();

function triangle(a, b, c, isFlat) {
    
    pointsArray.push(a);
    pointsArray.push(b);
    pointsArray.push(c);
    
    // normals are vectors
    
    if (isFlat == 0) // smooth shading
    {
    
    trueNormalsArray.push(a[0],a[1], a[2], 0.0);
    trueNormalsArray.push(b[0],b[1], b[2], 0.0);
    trueNormalsArray.push(c[0],c[1], c[2], 0.0);
    }
    else //flat shading
    {
    
    
    var diff1 = subtract(a, b);
    var diff2 = subtract(c, a);
    triangleNormal = normalize(cross( diff1, diff2 ));
    triangleNormal = vec4(triangleNormal);
    if (length(add( vec4(triangleNormal, 0), a)) < length(a))
        triangleNormal = -1 * triangleNormal;
        
    vertexNormalsArray.push(triangleNormal[0], triangleNormal[1], triangleNormal[2], 0.0);
    vertexNormalsArray.push(triangleNormal[0], triangleNormal[1], triangleNormal[2], 0.0);
    vertexNormalsArray.push(triangleNormal[0], triangleNormal[1], triangleNormal[2], 0.0);

    }
    
    num_vertices += 3;
}


function divideTriangle(a, b, c, count, isFlat) {
    if ( count > 0 ) {
        
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);
        
        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);
        
        divideTriangle( a, ab, ac, count - 1, isFlat );
        divideTriangle( ab, b, bc, count - 1, isFlat );
        divideTriangle( bc, c, ac, count - 1, isFlat);
        divideTriangle( ab, bc, ac, count - 1, isFlat );
    }
    else {
        triangle( a, b, c, isFlat );
    }
}


function tetrahedron(a, b, c, d, n, isFlat) {
    divideTriangle(a, b, c, n, isFlat);
    divideTriangle(d, c, b, n, isFlat);
    divideTriangle(a, d, b, n, isFlat);
    divideTriangle(a, c, d, n, isFlat);
}


function createSphere(a, b, c, d, numSubdivisions, isFlat) //set up normals and sphere vertices depending on flat or smooth shading
{
    pointsArray.length = 0;
    num_vertices = 0;
    if (isFlat == 1) //flat shading
        vertexNormalsArray.length = 0;
    else
        trueNormalsArray.length =0;
    tetrahedron(a, b, c, d, numSubdivisions, isFlat);
}


document.onkeydown = function buttons()
{
    //alert(event.keyCode);
    
    if(event.keyCode == 38) //up arrow
    {
        if (attach == 0)
            camera_transform = mult( translate (0, -.25, 0), camera_transform); //move the world down

    }
    else if(event.keyCode == 40) //down arrow
    {
        if (attach == 0)
            camera_transform = mult( translate (0, .25, 0), camera_transform); //move the world up

    }
    else if(event.keyCode == 37) //left arrow -> heading
    {
        if (attach == 1)
        {
            aHead = mult (rotate( -1, vec3(0, 1, 0)), aHead);
        }
        else
            camera_transform = mult (rotate( -1, vec3(0, 1, 0)), camera_transform); //right side done first
    }
    else if (event.keyCode == 39) //right arrow -> heading
    {
        if (attach == 1)
             aHead = mult (rotate( 1, vec3(0, 1, 0)), aHead);
        else
            camera_transform = mult (rotate( 1, vec3(0, 1, 0)), camera_transform); //right side done first
    }
    else if (event.keyCode == 73) //i key -> forward
    {
        if (attach == 0)
            camera_transform = mult( translate (0, 0, .25), camera_transform); //move the world
    }
    else if (event.keyCode == 74) //j key -> left
    {
        if (attach == 0)
            camera_transform = mult( translate (.25, 0, 0), camera_transform); //move the world
    }
    else if (event.keyCode == 75) // k key -> right
    {
        if (attach == 0)
            camera_transform = mult( translate (-.25, 0, 0), camera_transform); //move the world
    }
    else if (event.keyCode == 77) //m key -> backward
    {
        if (attach == 0)
            camera_transform = mult( translate (0, 0, -.25), camera_transform); //move the world
    }
    else if (event.keyCode == 82) //r key -> reset
    {
        camera_transform = mult( mat4(), translate (0, -13, -25));
        camera_transform = mult( rotate(30, vec3(1, 0, 0)), camera_transform);
        fov = 45;
        attach = 0;
        aHead = mat4();
    }
    else if(event.keyCode == 78) //n key
    {
        if (attach == 0)
            fov -= 0.5;
    }
    else if (event.keyCode == 87) //w key
    {
        if (attach == 0)
            fov += 0.5;
    }
    else if (event.keyCode == 76) //l key -> angle down
    {
        if (attach == 0)
            camera_transform = mult( rotate(1, vec3(1, 0, 0)), camera_transform);
    }
    else if (event.keyCode == 80) //p key -> angle up
    {
        if (attach == 0)
            camera_transform = mult( rotate(-1, vec3(1, 0, 0)), camera_transform);
    }
    else if (event.keyCode == 65) //a key -> attach/detach to planet
    {
        
        if (attach == 0)
            tempcam = camera_transform;
        
        
        if (attach == 1)
        {
            camera_transform = tempcam;
        }
        attach = !attach;
    }
    gl.uniformMatrix4fv(camera_transform_loc, false, flatten(camera_transform)); //send to shader

}

window.onload = function init()
{
    
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);;

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    
    
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
   
    // normals for smooth shading
    createSphere(va, vb, vc, vd, 3, 0);
    
    tnBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tnBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(trueNormalsArray), gl.STATIC_DRAW );
    
    tNormal = gl.getAttribLocation( program, "tNormal" );
    gl.vertexAttribPointer( tNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( tNormal);
    
    // normals for flat shading
    
    createSphere(va, vb, vc, vd, 3, 1);
    
    vnBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vnBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexNormalsArray), gl.STATIC_DRAW );
    
    vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);
    
    
    //vertices
    
    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    
    vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);


    
    
    //camera_transform = mult( mat4(), translate (0, 0, -40)); //position the world

    vColor_loc = gl.getUniformLocation(program, "vColor");
    gl.uniform4fv(vColor_loc, vec4(1.0, 1.0, 0.0, 1.0)); //send to shader
    model_transform_loc = gl.getUniformLocation(program, "model_transform");
    camera_transform_loc = gl.getUniformLocation(program, "camera_transform");
    projection_loc = gl.getUniformLocation(program, "projection");
    ambient_product_loc = gl.getUniformLocation(program, "ambientProduct");
    diffuse_product_loc = gl.getUniformLocation(program, "diffuseProduct");
    specular_product_loc = gl.getUniformLocation(program, "specularProduct");
    flat_loc = gl.getUniformLocation(program, "FLAT");
    gouraud_loc = gl.getUniformLocation(program, "GOURAUD");
    

    gl.uniform4fv( ambient_product_loc,flatten(ambientProduct) );
    gl.uniform4fv( diffuse_product_loc,flatten(diffuseProduct) );
    gl.uniform4fv( specular_product_loc,flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, 
                                        "shininess"),materialShininess );
    
    gl.uniform1f( gouraud_loc, 0 );
    gl.uniform1f( flat_loc, 0 );

    time = 0;
    lastTime = 0;
    camera_transform = mult( mat4(), translate (0, -13, -25));
    camera_transform = mult( rotate(30, vec3(1, 0, 0)), camera_transform);
    render();
}


function drawSphere()
{
    model_transform = mult(translate(1, 1 , 1), model_transform)
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv( ambient_product_loc,flatten(ambientProduct) );
    gl.uniform4fv( diffuse_product_loc,flatten(diffuseProduct) );
    gl.uniform4fv( specular_product_loc,flatten(specularProduct) );

    gl.uniformMatrix4fv(model_transform_loc, false, flatten(model_transform)); //send to shader
    for( var i=0; i<num_vertices; i+=3)
        gl.drawArrays( gl.TRIANGLES, i, 3 ); // called for each triangle in the sphere
    
    model_transform = mat4();
}

function changeComplexity(divisions) //provides normals and points of a cretain complexity for buffers to create a sphere
{
    createSphere(va, vb, vc, vd, divisions, 0);
    gl.bindBuffer( gl.ARRAY_BUFFER, tnBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(trueNormalsArray), gl.STATIC_DRAW );
    gl.vertexAttribPointer( tNormal, 4, gl.FLOAT, false, 0, 0 );
    createSphere(va, vb, vc, vd, divisions, 1);
    gl.bindBuffer( gl.ARRAY_BUFFER, vnBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexNormalsArray), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
}

function render()
{
    //calculates rotation angle using actual elapsed time to get 60 rpm
    var timeNow = new Date().getTime();
    if (lastTime!=0)
    {
        var elapsed = timeNow - lastTime;
        time += elapsed/16.66666667;
    }
    lastTime = timeNow;
    
    
    projection = perspective(fov*canvas.width/canvas.height, canvas.width/canvas.height, .1, 1000);
    model_transform = mat4();
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.uniformMatrix4fv(camera_transform_loc, false, flatten(camera_transform)); //send to shader
    gl.uniformMatrix4fv(projection_loc, false, flatten(projection)); //send to shader
    
    // medium to low complexity
    changeComplexity(2);

    // swampy, watery green gourad planet
    gl.uniform1f( gouraud_loc, 1 ); //set to gouraud shading
    lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
    lightDiffuse = vec4(1, .6, .6, 1.0 ); //light color of sun
    lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
    
    materialAmbient = vec4( 0.0, 1.0, 1.0, 0.8 );
    materialDiffuse = vec4( 0.2, 1.0, 0.2, 1.0 );
    materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

    model_transform = mult(translate(14, 0 , 0), model_transform);
    model_transform = mult(model_transform, scale(1.4, 1.4, 1.4));
    model_transform = mult(rotate(.5*time, vec3(0, 1, 0)), model_transform);
    var tempswamp = model_transform;
    if (attach == 1) //attach moon to swampy planet
    {

        camera_transform = translate(-1, -1 , -1);
        camera_transform = mult(rotate(-.5*time, vec3(0, 1, 0)), camera_transform);
        camera_transform = mult(translate(-12.5, 0 , 0), camera_transform);
        camera_transform = mult(aHead, camera_transform);
        gl.uniformMatrix4fv(camera_transform_loc, false, flatten(camera_transform)); //send to shader
    }
    
    drawSphere();

    gl.uniform1f( gouraud_loc, 0 );
    
    
    //icy planet flat shaded
    gl.uniform1f( flat_loc, 1 ); //set to flat shading
    lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
    lightDiffuse = vec4(1, .6, .6, 1.0 );
    lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
    
    materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
    materialDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
    materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
    
    model_transform = mult(translate(7, 0 , 0), model_transform);
    model_transform = mult(model_transform, scale(.9, .9 , .9));
    model_transform = mult(rotate(1.1*time, vec3(0, 1, 0)), model_transform)
    
    drawSphere();
    
    gl.uniform1f( flat_loc, 0 );

    
    //high complexity
    changeComplexity(5);
    
    //moon on swampy green planet

    lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
    lightDiffuse = vec4(1, .6, .6, 1.0 );
    lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
    
    materialAmbient = vec4( 0.8, 0.5, 0.9, 1.0 );
    materialDiffuse = vec4( 0.8, 0.5, 0.9, 1.0 );
    materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
    //model_transform = tempswamp;
    model_transform = mult(translate(1.7, 0 , 0), model_transform);
    model_transform = mult(model_transform, scale(.4, .4 , .4));
    model_transform = mult(rotate(3*time, vec3(0, 1, 0)), model_transform);
    model_transform = mult(tempswamp, model_transform);
    
    drawSphere();
    
    //calm smooth water phong planet
    
    lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
    lightDiffuse = vec4(1, .6, .6, 1.0 );
    lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
    
    materialAmbient = vec4( 0.0, 0.4, 1.0, 1.0 );
    materialDiffuse = vec4( 0.0, 0.4, 1.0, 1.0 );
    materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
    model_transform = mult(translate(-10, 0 , 0), model_transform);
    model_transform = mult(rotate(1.5*time, vec3(0, 1, 0)), model_transform)
    
    drawSphere();
    
    //sun
    lightAmbient = vec4(1, .6, .6, 1.0 );
    lightDiffuse = vec4( 0, 0, 0, 0.0 );
    lightSpecular = vec4( 0, 0, 0, 0.0 );
    
    materialAmbient = vec4( 1.0, 1.0, 0.0, 1.0 );
    materialDiffuse = vec4( 0, 0, 0, 0.0 );
    materialSpecular = vec4( 0, 0, 0, 0.0 );
    
    
    model_transform = mult(model_transform, scale(5, 5 , 5));
    drawSphere();
    
    // medium-high complexity
    changeComplexity(3);
    
    //mud covered brownish orange planet, gourand shading
    gl.uniform1f( gouraud_loc, 1 ); //set to gouraud shading
    
    lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
    lightDiffuse = vec4(1, .6, .6, 1.0 );
    lightSpecular = vec4( 0.0, 1.0, 1.0, 1.0 );
    
    materialAmbient = vec4( 1.0, 0.7, 0.0, 1.0 );
    materialDiffuse = vec4( 1.0, 0.7, 0.0, 1.0 );
    materialSpecular = vec4( 0.0, 0.0, 0.0, 1.0 );
    
    model_transform = mult(translate(-18.3, 0 , 0), model_transform);
    model_transform = mult(model_transform, scale(1.2, 1.2 , 1.2));

    model_transform = mult(rotate(time, vec3(0, 1, 0)), model_transform)
    drawSphere();
    gl.uniform1f( gouraud_loc, 0 ); //set to gouraud shading
    
    requestAnimationFrame( render );
}

