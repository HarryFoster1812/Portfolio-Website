---
title: "The Hello World of graphics programming"
date: "2025-09-08"
description: "Drawing a triangle using OpenGL and GLFW on Linux"
tags:
  - OpenGL
  - Graphics Programming
  - GLFW
  - C++
project:
  name: "Learn OpenGL Triangle Example"
  slug: "learnopengl"
featured: false
---

## Setup

One of the barriers to entry when starting to learn OpenGL is being able to link all of the libraries nessesary. This guide will be for arch linux specifically (although it should work on any linux distro).

### Window Manager

The very first library you will need to install is the window library that you want to use, in this guide and in general GLFW is a good starting point for beginners.

Other popular libraries include:

- SDL 2/3
- GLUT
- CPW

To install glfw run:

```bash
sudo pacman -Syu glfw
```

### OpenGL initalisation

OpenGL is just a specification and on  different divers and OS's the location of OpenGL functions differs and requires runtime lookup, this is why GLAD exists. GLAD is a open source library which generates the proper configuration files for the OpenGL version we want to use.

Go to:
<https://glad.dav1d.de/>

Options:

- Language: C/C++
- Specification: OpenGL
- API: gl: 3.3
- Profile: Core
- Generate Loader: true
- Local files: true

Click generate, and copy all of the files to your include directory

Your project directory should look like this:

```bash
.
├── include
│   └── glad
│       ├── glad.c
│       ├── glad.h
│       └── khrplatform.h
└── main.cpp

3 directories, 5 files

```

## Code

Ok, now we have the required libraries we can start making something.

### Creating a window

to begin we are going to include the required headers:

```cpp
#include <glad/glad.h>
#include <GLFW/glfw3.h>

#include <iostream>
```

>[NOTE]
> Always include GLAD before GLFW, since GLFW uses OpenGL function pointers that GLAD provides.

in the main function we are going to start and create a blank window:

```cpp
int main(int argc, char *argv[]) {
    glfwInit();
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

    // Create a window arguments: width, height, window title, monitor, failure
    // return?
    GLFWwindow *window = glfwCreateWindow(800, 600, "OpenGL Hello World", NULL, NULL);
    // catch failure
    if (window == NULL) {
        std::cout << "Failed to create GLFW window" << std::endl;
        glfwTerminate();
        return 1;
    }
    glfwMakeContextCurrent(window);
    // basic render loop
    while (!glfwWindowShouldClose(window)) {

        // draw call
        glfwSwapBuffers(window);
        glfwPollEvents();
    }

    // close and clean any memory used
    glfwTerminate();
    return 0;
}
```

to compile i am using g++:

```bash
g++ main.cpp include/glad/glad.c -o program -Iinclude -lglfw -lGL -ldl
```

then just run

```bash
./program
```

If all was successful you will see a black window!

### OpenGL setup

before the render loop we are going to setup OpenGL and set the viewport

```cpp
  // loads and changes the opengl settings for the target OS when compiling
  if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress)) {
    std::cout << "Failed to initialize GLAD" << std::endl;
    return -1;
  }

  // sets the viewport for opengl, arguments: startx, starty, width, height
  glViewport(0, 0, 800, 600);
  // opengl coordinate system maps from [-1, 1] so (-1, 1) would be (0,0)
  // (1, -1) would be 800, 600

  // setting the resize callback
  glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
```

we will need to create the call back:

```cpp
void framebuffer_size_callback(GLFWwindow *window, int width, int height) {
  glViewport(0, 0, width, height);
}
```

What this snippet does to load GLAD, and set the viewport of the glfw window. We also setup a callback so that when we resize the window the viewport will also change.

### Defining Geometry

To draw a simple triangle be define its verticies:

```cpp
float vertices[] = {
    -0.5f, -0.5f, 0.0f,  // left
     0.5f, -0.5f, 0.0f,  // right
     0.0f,  0.5f, 0.0f   // top
};

```

To render this we need to send this information to the GPU:

```cpp
  // create a buffer that will be stored on the GPU
  unsigned int VBO, VAO;
  glGenVertexArrays(1, &VAO);
  glGenBuffers(1, &VBO);
  glBindVertexArray(VAO);

  // bind GL_ARRAY_BUFFER to point to the VBO buffer
  glBindBuffer(GL_ARRAY_BUFFER, VBO);

  // send the vertices to the GPU buffer
  glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

  glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void *)0);
  glEnableVertexAttribArray(0);

  // note that this is allowed, the call to glVertexAttribPointer registered VBO
  // as the vertex attribute's bound vertex buffer object so afterwards we can
  // safely unbind
  glBindBuffer(GL_ARRAY_BUFFER, 0);

```

### Shaders

Every OpenGL program needs at the very least a vertex shader and a fragment shader to display something on the screen. These are small programs written in GLSL (OpenGL Shading Language) that run on the GPU. They are a core part of the modern OpenGL pipeline, providing immense flexibility and control over how your graphics are rendered.

#### Vertex Shaders

The vertex shader is executed once for each vertex you send to the GPU. Its primary job is to take the raw vertex data (like coordinates, normals, colors, etc.) and transform it into a new position. In our "Hello World" example, our vertex shader is very simple: it takes the input position (aPos) and sets the final output position (gl_Position) to the same value. This means it doesn't perform any complex transformations, but in a more advanced program, this is where you would apply transformations like translation, rotation, and scaling.

```glsl
#version 330 core
layout (location = 0) in vec3 aPos;
void main() {
    gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);
}
```

- `layout (location = 0) in vec3 aPos`: This is a shader input variable. It specifies that the input data for this shader, which is a 3-component vector (vec3) named aPos, comes from the vertex attribute at location 0. This corresponds to the glVertexAttribPointer(0, ...) call in our C++ code.

- `gl_Position`: This is a built-in output variable that holds the final, clipped position of the vertex. Everything the vertex shader outputs must eventually be assigned to this variable.

#### Fragment Shaders

The fragment shader runs after the vertex shader and is responsible for determining the final color of each pixel (or more accurately, each fragment) that will be drawn to the screen. A fragment is all the data needed to draw a single pixel, and the fragment shader's job is to compute the final color for that fragment. Our fragment shader is also very simple: it sets the color to a fixed red.

```glsl
#version 330 core
out vec4 FragColor;
void main() {
    FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
```

- `out vec4 FragColor`: This is a shader output variable. It is a 4-component vector (vec4) that will hold the final color of the fragment.

- `FragColor = vec4(1.0, 0.0, 0.0, 1.0)`: Here, we set the output color. The four components represent R, G, B, and A (Red, Green, Blue, Alpha), with each value ranging from 0.0 to 1.0. A value of (1.0, 0.0, 0.0, 1.0) results in a solid red color.

#### Our Program

```cpp
const char *vertexShaderSource =
    "#version 330 core\n"
    "layout (location = 0) in vec3 aPos;\n"
    "void main()\n"
    "{\n"
    " gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);\n"
    "}\0";

const char *fragmentShaderSource = "#version 330 core\n"
                                   "out vec4 FragColor;\n"
                                   "void main(){\n"
                                   "FragColor = vec4(1.0, 0.0, 0.0f, 1.0f);\n"
                                   "}\n";
```

In a real project these shaders are written into seperate files and loaded into the program but for simpllicity we are just goingot to write them directly into the source file.

#### Compiling Shaders

```cpp
  unsigned int vertexShader;
  vertexShader = glCreateShader(GL_VERTEX_SHADER);

  glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
  glCompileShader(vertexShader);

  int success;
  char infoLog[512];
  glGetShaderiv(vertexShader, GL_COMPILE_STATUS, &success);

  if (!success) {
    glGetShaderInfoLog(vertexShader, 512, NULL, infoLog);
    std::cout << "ERROR::SHADER::VERTEX::COMPILATION_FAILED\n"
              << infoLog << std::endl;
  }

  unsigned int fragmentShader;
  fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
  glShaderSource(fragmentShader, 1, &fragmentShaderSource, NULL);
  glCompileShader(fragmentShader);

  glGetShaderiv(fragmentShader, GL_COMPILE_STATUS, &success);

  if (!success) {
    glGetShaderInfoLog(fragmentShader, 512, NULL, infoLog);
    std::cout << "ERROR::SHADER::FRAGMENT::COMPILATION_FAILED\n"
              << infoLog << std::endl;
  }

  unsigned int shaderProgram;
  shaderProgram = glCreateProgram();

  glAttachShader(shaderProgram, vertexShader);
  glAttachShader(shaderProgram, fragmentShader);
  glLinkProgram(shaderProgram);

  glGetProgramiv(shaderProgram, GL_LINK_STATUS, &success);
  if (!success) {
    glGetProgramInfoLog(shaderProgram, 512, NULL, infoLog);
    std::cout << "ERROR::SHADER::PROGRAM::LINKING_FAILED\n"
              << infoLog << std::endl;
  }

  glDeleteShader(vertexShader);
  glDeleteShader(fragmentShader);
```

#### Using Shaders

```cpp
  while (!glfwWindowShouldClose(window)) {
    // Clear the color buffer with a background color
    glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT);

    glUseProgram(shaderProgram);
    glBindVertexArray(VAO);
    glDrawArrays(GL_TRIANGLES, 0, 3);

    glfwSwapBuffers(window);
    glfwPollEvents();
  }
```

## Full Program

```cpp
#include <glad/glad.h>

#include <GLFW/glfw3.h>
#include <iostream>

const char *vertexShaderSource =
    "#version 330 core\n"
    "layout (location = 0) in vec3 aPos;\n"
    "void main(){\n"
    "   gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);\n"
    "}\0";

const char *fragmentShaderSource =
    "#version 330 core\n"
    "out vec4 FragColor;\n"
    "void main(){\n"
    "   FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n"
    "}\n\0";

void framebuffer_size_callback(GLFWwindow *window, int width, int height) {
  glViewport(0, 0, width, height);
}

int main() {
  glfwInit();
  glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
  glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
  glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

  GLFWwindow *window =
      glfwCreateWindow(800, 600, "OpenGL Hello World", NULL, NULL);
  if (window == NULL) {
    std::cout << "Failed to create GLFW window" << std::endl;
    glfwTerminate();
    return -1;
  }
  glfwMakeContextCurrent(window);
  glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);

  if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress)) {
    std::cout << "Failed to initialize GLAD" << std::endl;
    return -1;
  }

  // Shaders
  unsigned int vertexShader = glCreateShader(GL_VERTEX_SHADER);
  glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
  glCompileShader(vertexShader);
  int success;
  char infoLog[512];
  glGetShaderiv(vertexShader, GL_COMPILE_STATUS, &success);
  if (!success) {
    glGetShaderInfoLog(vertexShader, 512, NULL, infoLog);
    std::cout << "ERROR::SHADER::VERTEX::COMPILATION_FAILED\n"
              << infoLog << std::endl;
  }

  unsigned int fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
  glShaderSource(fragmentShader, 1, &fragmentShaderSource, NULL);
  glCompileShader(fragmentShader);
  glGetShaderiv(fragmentShader, GL_COMPILE_STATUS, &success);
  if (!success) {
    glGetShaderInfoLog(fragmentShader, 512, NULL, infoLog);
    std::cout << "ERROR::SHADER::FRAGMENT::COMPILATION_FAILED\n"
              << infoLog << std::endl;
  }

  unsigned int shaderProgram = glCreateProgram();
  glAttachShader(shaderProgram, vertexShader);
  glAttachShader(shaderProgram, fragmentShader);
  glLinkProgram(shaderProgram);
  glGetProgramiv(shaderProgram, GL_LINK_STATUS, &success);
  if (!success) {
    glGetProgramInfoLog(shaderProgram, 512, NULL, infoLog);
    std::cout << "ERROR::SHADER::PROGRAM::LINKING_FAILED\n"
              << infoLog << std::endl;
  }
  glDeleteShader(vertexShader);
  glDeleteShader(fragmentShader);

  // Vertex Data
  float vertices[] = {-0.5f, -0.5f, 0.0f, 0.5f, -0.5f, 0.0f, 0.0f, 0.5f, 0.0f};

  unsigned int VBO, VAO;
  glGenVertexArrays(1, &VAO);
  glGenBuffers(1, &VBO);
  glBindVertexArray(VAO);

  glBindBuffer(GL_ARRAY_BUFFER, VBO);
  glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

  glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void *)0);
  glEnableVertexAttribArray(0);

  glBindBuffer(GL_ARRAY_BUFFER, 0);
  glBindVertexArray(0);

  // Main render loop
  while (!glfwWindowShouldClose(window)) {
    // Clear the color buffer with a black color
    glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT);

    glUseProgram(shaderProgram);
    glBindVertexArray(VAO);
    glDrawArrays(GL_TRIANGLES, 0, 3);

    glfwSwapBuffers(window);
    glfwPollEvents();
  }

  glDeleteVertexArrays(1, &VAO);
  glDeleteBuffers(1, &VBO);
  glDeleteProgram(shaderProgram);

  glfwTerminate();
  return 0;
}
```

## The Moment of Truth

To compile the program the command we used before should work again:

```bash
g++ main.cpp include/glad/glad.c -o program -Iinclude -lglfw -lGL -ldl
```

then just run

```bash
./program
```

If everything works you should see:

![Triangle Output](/blog-assets/opengl_triangle.jpg)

## Conclusion

Congratulations you have just started your journey into graphics programming. Before you start your own minecraft clone or a basic game engine there is so much more to learn.
The next steps you should take are:

- Loading Shaders from files (so you don't need to recompile your program every time you change the shaders)
- Drawing a rectangle
- Drawing a cube (its a lot harder than you think)
- Using textures for more interesting visuals

### Resources

There are countless OpenGL resources online. My personal favourites are:

- [LearnOpenGl](https://www.learnopengl.com)
- [OGLDev](https://ogldev.org/)
- [The Cherno](https://www.youtube.com/playlist?list=PLlrATfBNZ98foTJPJ_Ev03o2oq3-GGOS2)
