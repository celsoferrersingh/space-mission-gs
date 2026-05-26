@REM Maven Wrapper para Windows
@IF "%__MVNW_ARG0_NAME__%"=="" (SET "MAVEN_JAVA_EXE=%JAVA_HOME%\bin\java.exe")
@IF NOT "%JAVA_HOME%"=="" (SET "MAVEN_JAVA_EXE=%JAVA_HOME%\bin\java.exe")
@IF NOT EXIST "%MAVEN_JAVA_EXE%" (SET "MAVEN_JAVA_EXE=java.exe")

@SET WRAPPER_JAR="%BASEDIR%\.mvn\wrapper\maven-wrapper.jar"
@SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

@"%MAVEN_JAVA_EXE%" ^
  -classpath %WRAPPER_JAR% ^
  "-Dmaven.multiModuleProjectDirectory=%BASEDIR%" ^
  %MAVEN_OPTS% ^
  %WRAPPER_LAUNCHER% %*
