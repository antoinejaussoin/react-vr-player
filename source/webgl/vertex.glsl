attribute mediump vec2 aVertexPosition;

uniform mediump mat4 proj_inv;

varying mediump vec3 vDirection;

void main(void) {
  gl_Position = vec4(aVertexPosition, 1.0, 1.0);
  mediump vec4 projective_direction = proj_inv * gl_Position;
  vDirection = projective_direction.xyz / projective_direction.w;
}
