get fullName()
get lastName()
get firstName()
get middleName()

getAppointmentsAt(day = new Day())
get appointments()

getPostIdAt(day = new Day())
get postId()
getPostIdsAt(day = new Day())
get postIds()

getRecruitDayAt(day = new Day())
get recruitDay()
isRecruitedAt(day = new Day())
get isRecruited()

getQuitDayAt(day = new Day())
get quitDay()
isQuitedAt(day = new Day())
get isQuited()

seniorityAt(day = new Day())
get seniority()

addAppointment(postId, day)
editAppointment(postIdToEdit, dayToEdit, postId, day)
deleteAppointment(postId, day)
takeQuit(day = new Day())
setAppointments(appointments)

// private
\_appointmentsComparator(a, b)
\_getPostIdAppointmentsAt(day, postId)

# getPostIdAt

2017.01.01 2017.01.01 2017.02.01 2017.03.01 2017.04.011 2017.04.01
| senior_florist florist
| | | | | |
| ◎———————————————————————————————○———————————————————————————————●———————————————▶︎
| | | | | | |
undefined senior_florist senior_florist florist florist undefined undefined
