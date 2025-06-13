<?php

$hash = password_hash('admin123', PASSWORD_DEFAULT);
echo "Hashed password: $hash";
echo "<br>You can use this hash in your database for the admin user.\n";
