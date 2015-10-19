varying mediump vec3 vDirection;
uniform mediump float eye;
uniform mediump float projection;

uniform sampler2D uSampler;

#define PI 3.1415926535897932384626433832795

mediump vec4 directionToColor(mediump vec3 direction, mediump float eye, mediump float projection) {
  mediump float theta = atan(direction.x, -1.0 * direction.z);
  mediump float phi = atan(direction.y, length(direction.xz));

  if (abs(direction.x) < 1e-4 * abs(direction.z))
    theta = 0.5*PI * (1.0 - sign(-1.0 * direction.z));
  if (abs(direction.y) < 1e-4 * length(direction.xz))
    phi = 0.0;

  if (projection == 0.) {
    return texture2D(uSampler, vec2(mod(theta / (2.0*PI), 1.0), phi / PI + 0.5));
  } else {
    eye = 1. - eye;
    return texture2D(uSampler, vec2(mod(theta / (2.0*PI), 1.0), ((phi / PI + 0.5) + eye)/ 2.));
  }
}

void main(void) {
  gl_FragColor = directionToColor(vDirection, eye, projection);
}
