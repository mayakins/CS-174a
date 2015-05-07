READ ME: Assignment 2

Camera Control Keys:

up arrow - move camera up
down arrow - move camera down
left arrow - rotate camera left (change heading)
right arrow - rotate camera right (change heading)
l - angle down
p - angle up
i - move forward
m - move backward
j - move left
k - move right
r - reset view
n - narrow field of view
w - widen field of view
a - attach/detach to green planet

Description

I have created a function createSphere using the book functions which takes in 4 starting points of a tetrahedron, a number to determine the subdivisions of this tetrahedron (which will determine its complexity) and a integer that determines if the function is creating normals for flat or smooth shading. This function creates an array of vertices and normals for a sphere. If flat shading, it pushes normals onto vertexNormalsArray. If smooth, it pushes normals onto trueNormalsArray. These normals are stored in two separate buffers to be used in the shaders depending on the type of shading. the function changeComplexity recalculates these vertices and normals and resends them to the appropriate buffers. 

Each of the planets has a different color and orbiting speed. The rotations are made consistent in the browser by making use of the elapsed time between render calls. The sun is a warm orange color because it is relatively large compared to the other planets. This is also the color of the light source, which is made apparent by changing each planets lightDiffuse color to the color of the sun. This is most noticeable on the icy planet, which has become orange-toned due to the color of the light. The mud-color planet is gouraud shaded.

Uniform ints FLAT and GOURAUD are passed to the shaders to set the type of shading. Phong shading is done in the fragments shader while flat and gouraud shading are done in the vertex shader.

Extra Additions

I have reused the button function from project 1. This allows key input to be used. Other than the keys that were given in project 1, I have made the “a” key have attach/detach function which attaches to the swampy green planet. When attaching and detaching the camera position will return to the position it was in before it was last pressed. I have also given this swampy green planet a purple moon. I have also added functionality to the l and p keys, which rotate the camera downward and upward respectively.