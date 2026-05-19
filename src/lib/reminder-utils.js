export function calculateReminderStatus(reminder, currentOdometer) {
  let kmStatus = null;
  let kmRemaining = null;

  // 1. Odometer-based reminder check
  if (
    reminder.interval_km !== null &&
    reminder.interval_km !== undefined &&
    reminder.last_service_odometer !== null &&
    reminder.last_service_odometer !== undefined
  ) {
    const kmsSinceLast = currentOdometer - reminder.last_service_odometer;
    kmRemaining = reminder.interval_km - kmsSinceLast;

    if (kmRemaining <= 0) {
      kmStatus = 'OVERDUE';
    } else if (kmRemaining <= 500) {
      kmStatus = 'DUE SOON';
    } else {
      kmStatus = 'GOOD';
    }
  }

  let timeStatus = null;
  let daysRemaining = null;

  // 2. Time-based reminder check
  if (
    reminder.interval_months !== null &&
    reminder.interval_months !== undefined &&
    reminder.last_service_date
  ) {
    const lastDate = new Date(reminder.last_service_date);
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + reminder.interval_months);

    const today = new Date();
    // Normalize dates to midnight to avoid hourly time differences
    today.setHours(0, 0, 0, 0);
    nextDate.setHours(0, 0, 0, 0);

    const msRemaining = nextDate.getTime() - today.getTime();
    daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 0) {
      timeStatus = 'OVERDUE';
    } else if (daysRemaining <= 30) {
      timeStatus = 'DUE SOON';
    } else {
      timeStatus = 'GOOD';
    }
  }

  // 3. Combined status logic (taking the most urgent)
  if (kmStatus && timeStatus) {
    if (kmStatus === 'OVERDUE' || timeStatus === 'OVERDUE') {
      return {
        status: 'OVERDUE',
        color: 'danger',
        kmRemaining,
        daysRemaining,
        type: 'both'
      };
    }
    if (kmStatus === 'DUE SOON' || timeStatus === 'DUE SOON') {
      return {
        status: 'DUE SOON',
        color: 'warning',
        kmRemaining,
        daysRemaining,
        type: 'both'
      };
    }
    return {
      status: 'GOOD',
      color: 'success',
      kmRemaining,
      daysRemaining,
      type: 'both'
    };
  } else if (kmStatus) {
    return {
      status: kmStatus,
      color: kmStatus === 'OVERDUE' ? 'danger' : kmStatus === 'DUE SOON' ? 'warning' : 'success',
      kmRemaining,
      daysRemaining: null,
      type: 'odometer'
    };
  } else if (timeStatus) {
    return {
      status: timeStatus,
      color: timeStatus === 'OVERDUE' ? 'danger' : timeStatus === 'DUE SOON' ? 'warning' : 'success',
      kmRemaining: null,
      daysRemaining,
      type: 'time'
    };
  }

  return {
    status: 'UNKNOWN',
    color: 'text-secondary',
    kmRemaining: null,
    daysRemaining: null,
    type: 'unknown'
  };
}
