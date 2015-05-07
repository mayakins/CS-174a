
var canvas;
var gl;
var numVertices  = 14;
var numBorder = 24;
var vBuffer;
var bBuffer;
var vPosition;
var cCount = 0;
var fov = 30;
var toggle = 1;
var rot = 6;
camera_transform = mat4();



var vertices2 = [ //cube fill indices for use with single triangle strip
    vec3( -1, -1, -1 ),
    vec3( 1, -1, -1 ),
    vec3( -1, -1,  1 ),
    vec3( 1, -1,  1 ),
    vec3( 1, 1,  1 ),
    vec3( 1, -1, -1 ),
    vec3( 1, 1,  -1 ),
    vec3( -1, -1, -1 ),
    vec3( -1, 1, -1 ),
    vec3( -1, -1,  1 ),
    vec3( -1, 1,  1 ),
    vec3( 1, 1,  1 ),
    vec3( -1, 1, -1 ),
    vec3( 1, 1,  -1 )
    
                    
];

var vertices = [ //border indices
    vec3( -1, -1,  1 ),
    vec3( -1,  1,  1 ),
    vec3(  1,  1,  1 ),
    vec3(  1, -1,  1 ),
    vec3( -1, -1, -1 ),
    vec3( -1,  1, -1 ),
    vec3(  1,  1, -1 ),
    vec3(  1, -1, -1 )

];



var crossHair = [ //cross hair vertices
    vec3( -1, 0, 2 ),
    vec3( 1, 0, 2),
    vec3(0, 1, 2),
    vec3(0, -1, 2)

];


// indices for cube border

var indices = [
       
    0, 1, 1, 2, 2, 3, 3, 0,
    4, 5, 5, 6, 6, 7, 7, 4,
    0, 4, 1, 5, 2, 6, 3, 7
    ];


function chooseColors()
{
    cCount = (cCount + 1)%8;
    
    if (cCount == 0)
    {
        gl.uniform4fv(vColor_loc, vec4( 1.0, 0.0, 0.0, 1.0 )); //send red to shader

    }
    else if (cCount == 1)
    {
        gl.uniform4fv(vColor_loc, vec4( 1.0, 0.5, 0.0, 1.0 )); //send orange to shader
    }
    else if (cCount == 2)
    {
        gl.uniform4fv(vColor_loc, vec4( 0.0, 1.0, 0.0, 1.0 )); //send green to shader

    }
    else if (cCount == 3)
    {
        gl.uniform4fv(vColor_loc, vec4( 0.0, 0.0, 1.0, 1.0 )); //send blue to shader
    }
    else if (cCount == 4)
    {
        gl.uniform4fv(vColor_loc, vec4( 1.0, 0.0, 1.0, 1.0 )); //send magenta to shader

    }
    else if (cCount == 5)
    {
        gl.uniform4fv(vColor_loc, vec4( 0.0, 1.0, 1.0, 1.0 )); //send cyan to shader
    }
    else if (cCount == 6)
    {
        gl.uniform4fv(vColor_loc, vec4( 1.0, 0.5, 0.5, 1.0 )); //send salmon to shader

    }
    else
    {
        gl.uniform4fv(vColor_loc, vec4( 0.5, 0.5, 1.0, 1.0 )); //send lavendar to shader
    }
}

document.onkeydown = function buttons()
{
    //alert(event.keyCode);
    
    if(event.keyCode == 38) //up arrow
    {
        camera_transform = mult( translate (0, -.25, 0), camera_transform); //move the world down

    }
    else if(event.keyCode == 40) //down arrow
    {
        camera_transform = mult( translate (0, .25, 0), camera_transform); //move the world up

    }
    else if (event.keyCode == 67) //c -> color
    {
        cCount = (cCount + 1)%8;
    }
    else if(event.keyCode == 37) //left arrow -> heading
    {
        camera_transform = mult (rotate( -1, vec3(0, 1, 0)), camera_transform); //right side done first
    }
    else if (event.keyCode == 39) //right arrow -> heading
    {
        camera_transform = mult (rotate( 1, vec3(0, 1, 0)), camera_transform); //right side done first
    }
    else if (event.keyCode == 73) //i key -> forward
    {
        camera_transform = mult( translate (0, 0, .25), camera_transform); //move the world
    }
    else if (event.keyCode == 74) //j key -> left
    {
        camera_transform = mult( translate (.25, 0, 0), camera_transform); //move the world
    }
    else if (event.keyCode == 75) // k key -> right
    {
        camera_transform = mult( translate (-.25, 0, 0), camera_transform); //move the world
    }
    else if (event.keyCode == 77) //m key -> backward
    {
        camera_transform = mult( translate (0, 0, -.25), camera_transform); //move the world
    }
    else if (event.keyCode == 82) //r key -> reset
    {
        camera_transform = mult( mat4(), translate (0, 0, -40)); //position the world
        fov = 30;
    }
    else if(event.keyCode == 78) //n key
    {
        fov -= 0.5;
    }
    else if (event.keyCode == 87) //w key
    {
        fov += 0.5;
    }
    else if  (event.keyCode == 187) // plus key
    {
        toggle = (toggle + 1) % 2;
    }
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
    
    // array element buffer
    
    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);
    
    /* VERTEX BUFFERS */

    //border vertex array attribute buffer
    
    bBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
    
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    // vertex array for fill attribute buffer
    
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices2), gl.STATIC_DRAW );

    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    
    // cross hair vertices
    
    chBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, chBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(crossHair), gl.STATIC_DRAW );
    
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
 

    camera_transform = mult( mat4(), translate (0, 0, -40)); //position the world
    
    vColor_loc = gl.getUniformLocation(program, "vColor");
    model_transform_loc = gl.getUniformLocation(program, "model_transform");
    camera_transform_loc = gl.getUniformLocation(program, "camera_transform");
    projection_loc = gl.getUniformLocation(program, "projection");

    
    render();
}


function drawCube() // set up correct buffers for cubes and draw
{
    model_transform = mult(model_transform, rotate(rot , vec3(0, 1, 0))); // make cubes spin
    model_transform = mult(model_transform, scale(scale_val , scale_val, scale_val)); // make cubes shrink and grow
    
    gl.uniformMatrix4fv(model_transform_loc, false, flatten(model_transform)); //send to shader
    
    // choose cube color and draw
    
    chooseColors();
    
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer ); // bind vertices for triangle strip configuration
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, numVertices ); //draw cube
    
    // set up and draw white borders
    
    gl.uniform4fv(vColor_loc, vec4( 1.0, 1.0, 1.0, 1.0 )); //send white to shader as border color
    gl.bindBuffer( gl.ARRAY_BUFFER, bBuffer ); //switch vertices buffers
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    
    gl.drawElements( gl.LINES, numBorder, gl.UNSIGNED_BYTE, 0 ); //draw outline
}

function render()
{
    model_transform = mat4();
    temp = mat4();
    
    projection = perspective(fov*canvas.width/canvas.height, canvas.width/canvas.height, .1, 1000);
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    rot = (rot + 6) %360; //update rotation angle
    scale_val = Math.sin(rot)*.1 +1; //update scale angle
    
    gl.uniformMatrix4fv(camera_transform_loc, false, flatten(camera_transform)); //send to shader
    gl.uniformMatrix4fv(projection_loc, false, flatten(projection)); //send to shader
    
    //CUBE 1
    model_transform = mult( model_transform, translate (10, 10 , 10));
    drawCube();
    
    
    //CUBE 2
    
    model_transform = mult( mat4(), translate (-10, 10 , 10)); //place cube
    drawCube();
    
    //CUBE 3
    
    model_transform = mult( mat4(), translate (-10, -10 , 10)); //place cube
    drawCube();
    
    //CUBE 4
    
    model_transform = mult( mat4(), translate (-10, -10 , -10));//place cube
    drawCube();
    
    // CUBE 5
    
    model_transform = mult( mat4(), translate (10, -10 , 10)); //place cube
    drawCube();
    
    // CUBE 6
    
    model_transform = mult( mat4(), translate (10, 10 , -10)); //place cube
    drawCube();
    
    //CUBE 7
    
    model_transform = mult( mat4(), translate (-10, 10 , -10)); //place cube
    drawCube();
    
    //CUBE 8
    
    model_transform = mult( mat4(), translate (10, -10 , -10)); //place cube
    drawCube();
    
    if (toggle)
    {
        temp = camera_transform; //save camera matrix for cubes
        model_transform = mat4();
        camera_transform = mat4();
        
        projection = ortho(-35 *canvas.width/canvas.height, 35*canvas.width/canvas.height, -35, 35, -35 ,35); //orthographic projection
        
        gl.uniformMatrix4fv(model_transform_loc, false, flatten(model_transform)); //send to shader
        gl.uniformMatrix4fv(camera_transform_loc, false, flatten(camera_transform)); //send to shader
        gl.uniformMatrix4fv(projection_loc, false, flatten(projection)); //send to shader
        
        gl.bindBuffer( gl.ARRAY_BUFFER, chBuffer ); //bind cross hair vertices
        gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
        
        gl.uniform4fv(vColor_loc, vec4( 1.0, 1.0, 1.0, 1.0 )); //send white to shader as crosshair color
        
        gl.drawArrays( gl.LINES, 0, 4 ); //draw crosshair
        
        camera_transform = temp; //reset camera for cubes


    }





    requestAnimFrame( render );
}

