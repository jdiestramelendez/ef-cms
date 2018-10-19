#!/usr/bin/env groovy

pipeline {

  agent any

  stages {
    stage('init') {
      steps {
        script {
          def scmVars = checkout scm
          print scmVars
          env.GIT_PREVIOUS_SUCCESSFUL_COMMIT = scmVars.GIT_PREVIOUS_SUCCESSFUL_COMMIT
          env.GIT_COMMIT = scmVars.GIT_COMMIT
        }
      }
    }
    stage('components') {
      parallel {
        stage('web-client') {
          when {
            expression {
              return checkCommit('web-client')
            }
          }
          steps {
            build job: 'ef-cms-ui', parameters: [
              [$class: 'StringParameterValue', name: 'sha1', value: "${GIT_COMMIT}"],
              [$class: 'StringParameterValue', name: 'target_sha1', value: "${env.CHANGE_TARGET}"],
              [$class: 'StringParameterValue', name: 'branch_name', value: "${env.BRANCH_NAME}"]
            ]
          }
        }
        stage('serverless-api') {
          when {
            expression {
              return checkCommit('serverless-api')
            }
          }
          steps {
            build job: 'ef-cms-api', parameters: [
              [$class: 'StringParameterValue', name: 'sha1', value: "${GIT_COMMIT}"],
              [$class: 'StringParameterValue', name: 'target_sha1', value: "${env.CHANGE_TARGET}"],
              [$class: 'StringParameterValue', name: 'branch_name', value: "${env.BRANCH_NAME}"]
            ]
          }
        }
      }
    }
  }
}

def checkCommit(folder) {
  def target = null
  if (env.CHANGE_TARGET) {
    echo 'using change target'
    target = env.CHANGE_TARGET
  } else {
    echo 'using git previous successful commit'
    target = env.GIT_PREVIOUS_SUCCESSFUL_COMMIT
  }
  def matches = sh(returnStatus:true, script: "git diff --name-only origin/${target} | grep '^${folder}'")
  return !matches
}