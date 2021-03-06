/*
 * Author: Matt Thomson <red.cataclysm@gmail.com>
 *
 * This work is licensed under the Creative Commons Attribution 4.0 
 * International License. To view a copy of this license, 
 * visit http://creativecommons.org/licenses/by/4.0/ or send a letter 
 * to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
*/

const request = require('superagent');
const authAPI = require('../../auth');

const domain = 'http://localhost:9876';
const courseEndpoint = '/learn/api/public/v1/courses/';

function get (courseId) {
  return new Promise((resolve, reject) => {
    authAPI.getToken()
      .then((token) => {
        console.log(`-> BB [GET]: ${domain}${courseEndpoint}externalId:${courseId}/users`);
        request.get(`${domain}${courseEndpoint}externalId:${courseId}/users`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, asyncRes) => {
            if (err || asyncRes.status !== 200) {
              return reject(err || asyncRes.status);
            }

            return resolve(JSON.parse(asyncRes.text));
          });
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

function getStudents (courseId) {
  return new Promise((resolve, reject) => {
    get(courseId)
      .then((students) => {
        return resolve(filterStudents(students.results));
      })
      .catch((err) => {
        return reject(err);
      })
  })
}

function filterStudents (users) {
  return users.filter((user) => {
    return user.courseRoleId === 'Student';
  });
}

exports.get = get;
exports.getStudents = getStudents;
