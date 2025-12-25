# Política de Seguridad

Gracias por tomarte el tiempo para ayudar a mantener este proyecto seguro. Esta política describe cómo reportar vulnerabilidades, cuáles son nuestros plazos y buenas prácticas para la divulgación responsable.

## Alcance
Aplica a este repositorio y a los artefactos producidos por él (paquetes, builds públicos, imágenes compartidas). No cubre servicios externos no administrados por los mantenedores.

## Cómo reportar una vulnerabilidad (divulgación responsable)
1. Crea un issue privado en GitHub o envía un correo a security@your-domain.example (sustituir por la dirección de contacto del proyecto). Marca el asunto como `Security: <breve descripción>`.
2. Incluye en el reporte:
	- Descripción clara del problema.
	- Pasos mínimos para reproducirlo (POC) y resultados esperados vs. observados.
	- Versiones afectadas (commit SHA / tag / versión npm / Angular version).
	- Grado de acceso requerido para explotar (público, autenticado, admin).
	- Impacto estimado y posibles mitigaciones temporales.
	- Archivos de log o trazas relevantes (si procede), evitando compartir datos sensibles.
3. Si el exploit requiere artefactos binarios o datos, proporciona enlaces seguros o adjuntos cifrados.
4. No publiques el problema públicamente hasta que el equipo de seguridad lo confirme o coordine la divulgación.

## Canales de comunicación
- Issue privado en GitHub (preferido).
- Correo: zunigaezer@gmail.com
- Para contactos urgentes o si la vulnerabilidad es activa y explotada, incluye "URGENT" en el asunto.

## Plazos y respuesta
- Confirmación de recepción: dentro de 48 horas.
- Evaluación inicial y clasificación: dentro de 7 días laborales.
- Plan de mitigación / arreglo: objetivo de 30 días para vulnerabilidades de severidad alta, sujeto a la complejidad y a la disponibilidad de mantenimiento.

Si el equipo no puede arreglar en ese plazo, publicaremos una mitigación temporal y una estimación de tiempo para la corrección.

## Clasificación de severidad (orientativa)
- Crítica: ejecución remota de código, pérdida de datos, bypass de autenticación sin interacción del usuario.
- Alta: acceso a datos sensibles o escalada privilegiada que requiere condiciones limitadas.
- Media: fugas de información no sensibles, CSRF sin impacto mayor, problemas locales.
- Baja: problemas de configuración, mejoras de seguridad, info-leaks de bajo riesgo.

## Recompensas / agradecimientos
No hay programa formal de recompensas por defecto. Agradecemos reportes responsables y los mencionaremos en `SECURITY.md` o `CHANGELOG.md` según proceda.

## Información sensible y tokens
- Nunca envíes claves privadas, contraseñas o tokens en texto plano por los canales públicos.
- Si el reporte necesita evidencia que contenga datos sensibles, usa archivos cifrados o un canal seguro.

## Proceso de corrección y divulgación
1. El equipo valida y reproduce el problema en un entorno de prueba.
2. Se desarrolla y prueba un parche, idealmente con una PR interna y pruebas unitarias/e2e que eviten regresiones.
3. Se publica la corrección en una release o versión parcheada.
4. La divulgación pública se coordina para proteger a los usuarios: se anunciará la vulnerabilidad, el impacto y la actualización recomendada.

## Dependencias y escaneo automatizado
Recomendamos ejecutar escaneos automáticos de dependencias (por ejemplo, GitHub Dependabot, npm audit) y mantener las dependencias actualizadas. Si detectas una vulnerabilidad en una dependencia, indícalo en tu reporte y preferiblemente incluye el `npm audit` output.

## Contacto y buen uso
Por favor sigue prácticas de divulgación responsable: no explotar vulnerabilidades en sistemas en producción y evita causar daño. Si necesitas anonimato para reportar, indica tu preferencia en el mensaje.