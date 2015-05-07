READ ME

Camera Control Keys
up arrow - move camera up
down arrow - move camera down
c - change cube colors
left arrow - rotate camera left (change heading)
right arrow - rotate camera right (change heading)
i - move forward
m - move backward
j - move left
k - move right
r - reset view
n - narrow field of view
w - widen field of view
+ - toggle crosshair over scene



General Project:
I created three different vertex buffers, one for the border (bBuffer), one for drawing the cubes with  triangle strips (vBuffer) and one for drawing the cross hair (chBuffers). I made a global counter cCount that is used in the function chooseColors to select and bind a color buffer for a cube. I also have a function called buttons that deals with key input. Most keys change the camera_transform matrix that shifts the world. I also have a drawCube function to which chooses a cube color then calls drawArrays and drawElements to draw the cube and its outline.

Extra Credit:
I completed all the extra credit except for submitting it early. I ordered my cube vertices in
in the array vertices2 to create a cube using a single triangle strip. I smoothly rotate by 60rpm and scale my cubes by keeping a constant rot. Each time I render it increments rot, the angle used for the rotate function, by 6 degrees. This create a 60 rpm rotation. I also use rot to scale my cubes by using this angle in a sin function to make it sinusoidal scale. The rotate and scale is done in drawCube. The professor hinted on Piazza that the rotate function already makes use of quaternions. Therefor by using the rotate function in drawCube I made use of quaternions. I have also been managing my code on GitHub. 