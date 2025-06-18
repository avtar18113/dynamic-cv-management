<?php

$hash = password_hash('123456', PASSWORD_DEFAULT);
echo "Hashed password: $hash";
echo "<br>You can use this hash in your database for the admin user.\n";
